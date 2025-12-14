// Render architecture list
["aarch64", "armhfp", "i386", "ppc64le", "s390x", "x86_64"].forEach((arch) => {
    $("#archi-list").append(`
      <div class="form-check">
        <input class="form-check-input" type="radio" name="architecture" id="architecture-${arch}" value=${arch}>
        <label class="form-check-label" for="architecture-${arch}">${arch}</label>
       </div>
`);
});
//

let versionSelected = false;
let archiSelected = false;

// Event listeners
// Event listener to auto detect Fedora version & architecture
$("#auto-detect").on("click", async () => {
    const architecture = archiAutoDetect();
    $(`#architecture-${architecture}`).prop("checked", true).trigger("change");

    const {version, isFedora} = await osAutoDetect();
    $("#version").val(version).trigger("input");
    if (!isFedora) {
        $("#version-list").append(
            "<p class='text-center my-3'>Fedora Linux not found<br>Autoselecting <b>38</b></p>"
        );
    }
})

//
//

// Event listener to check for architecture radio change
$("input[name='architecture']").on("change", () => {
    archiSelected = true;
    showMirrors();
});
//

// Event listener to check for version radio change
$("#version").on("input", () => {
    versionSelected = true;
    showMirrors();
});
//

// Function to apply night mode
const applyNightMode = (isNightMode) => {
    if (isNightMode) {
        $('body').css({'color': 'white', 'background-color': 'black'});
        $('#night_mode').prop('checked', true);
    } else {
        $('body').css({'color': 'black', 'background-color': 'white'});
        $('#night_mode').prop('checked', false);
    }
};

// Auto-detect system theme preference on page load
if (window.matchMedia) {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Apply initial theme based on system preference
    applyNightMode(prefersDarkMode.matches);
    
    // Listen for changes in system theme
    prefersDarkMode.addEventListener('change', (e) => {
        applyNightMode(e.matches);
    });
}

// Event listener for manual night mode toggle
$("#night_mode").on("change", (e) => {
    applyNightMode(e.target.checked);
});

//

// Functions

// Auto detect Fedora version
async function osAutoDetect() {
    try {
        const version = await sysinfo.version()
        if (version === 'Other') {
            return {version: 38, isFedora: false}
        }
        return {version, isFedora: true};
    } catch (error) {
        return {version: 38, isFedora: false};  // If non-fedora linux, then return 38
    } finally {
        $("#auto-detect").off("click");
    }
}

//

// Auto detect architecture
const archiAutoDetect = () => {
    let architecture = sysinfo.arch();
    if (architecture === "x64") {
        architecture = "x86_64";
    }
    $("#auto-detect").off("click");
    return architecture;
};
//

//

let fedoraVersion;
let archi;
const showMirrors = async () => {
    $("#mirrors").empty();
    fedoraVersion = parseInt($("#version").val());
    archi = $("input[name='architecture']:checked").val();
    if (versionSelected && archiSelected) {
        $("#select_first").addClass("d-none");
        $("#mirrors").removeClass("d-none");

        $(`<div class="loader text-primary" role="status"></div>`).insertAfter(
            $("#mirrors")
        );
        try {
            let mirrorList;
            const mirrors = await store.fetch();
            if (Object.keys(mirrors?.mirrors || {}).length === 0 || timeDifference(mirrors?.info?.downloadedAt) > 72 || parseInt(mirrors?.info?.version) !== parseInt(fedoraVersion) || mirrors?.info?.archi !== archi) {
                mirrorList = await mirrorInfo.get(fedoraVersion, archi);
                await store.store(mirrorList, fedoraVersion, archi);
                await renderMirrors(mirrorList);
            } else {
                await renderMirrors(mirrors.mirrors)
            }
        } catch (e) {
            $('#mirrors').html(`<p class='text-center text-danger'>${e.message}</p>`)
            return;
        }
    }
};

const regionNames = new Intl.DisplayNames(
    ['en'], {type: 'region'}
);

const renderMirrors = (mirrors) => {
    $("#mirrors").empty();
    $("#select_all_div").remove();
    $(`
  <div class="form-check" id="select_all_div">
    <input type="checkbox" class="form-check-input" id="select_all" name="Select All" value="Select All">
    <label for="select_all" class="form-check-label">Select All</label>
  </div>
  `).insertAfter("#select_first");

    $("#select_all").on("change", () => {
        $("input[name='mirror']")
            .prop("checked", $("#select_all").prop("checked"))
            .trigger("change");
    });

    Object.keys(mirrors).forEach((key) => {
        $("#mirrors")
            .append(
                `
        <div class="accordion-item" style="">
    <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${key}"
            aria-expanded="true" aria-controls="collapseOne">
            ${regionNames.of(key)} <span class="fi fi-${key.toLowerCase()} mx-1"></span> (${
                    mirrors[key].length
                })
        </button>
    </h2>
    <div id="${key}" class="accordion-collapse collapse" aria-labelledby="headingOne"
        data-bs-parent="#accordionExample">
        <div class="accordion-body">
        <div class="form-check mb-2">
            <input type="checkbox" class="form-check-input country-select-all" id="select-all-${key}" data-country="${key}">
            <label for="select-all-${key}" class="form-check-label"><strong>Select All ${regionNames.of(key)}</strong></label>
        </div>
        <hr>
        ${mirrors[key]
                    .map((mirror) => {
                        return `<div class="form-check">
          <input class="form-check-input country-mirror" name="mirror" type="checkbox" value="${mirror}" id="${mirror}" data-country="${key}">
          <label class="form-check-label" for="${mirror}">
              ${mirror}
          </label>
      </div>`;
                    })
                    .join("")}
        </div>
    </div>
</div>
        `
            )
            .removeClass("d-none");
    });
    
    // Add event listeners for country-specific select all checkboxes
    $(".country-select-all").on("change", function() {
        const country = $(this).data("country");
        const isChecked = $(this).prop("checked");
        $(`.country-mirror[data-country="${country}"]`)
            .prop("checked", isChecked)
            .trigger("change");
    });
    
    // Update country select-all checkbox when individual mirrors are toggled
    $(".country-mirror").on("change", function() {
        const country = $(this).data("country");
        const totalMirrors = $(`.country-mirror[data-country="${country}"]`).length;
        const checkedMirrors = $(`.country-mirror[data-country="${country}"]:checked`).length;
        $(`#select-all-${country}`).prop("checked", totalMirrors === checkedMirrors);
    });
    $(".loader").remove();
    $(".operation-button").removeClass("d-none");
};

let stop = false;
$("#test-speed").on('click', async () => {
    stop = false;
    const selectedMirrors = $("input[name='mirror']:checked");
    const version = await speedtest.checkRelease(fedoraVersion, archi)
    const mirrors = selectedMirrors.map((mirror) => {
        return selectedMirrors[mirror].value
    })
    $('#result').empty();
    $('#selection_area').addClass('d-none');
    removeEventListeners();
    for (const mirror of mirrors) {
        if (!stop) {
            renderResult(mirror)
            const r = await speedtest.main(mirror, version, fedoraVersion, archi);
            $(`#loader-${$.escapeSelector(mirror)}`).remove();
            $(`#${$.escapeSelector(mirror)}`).append(`<p class="mx-3">${r.speed || 0} Mbps</p>`);
        }
    }
})

const removeEventListeners = () => {
    $("#auto-detect").off("click");
    $("input[name='architecture']").off("change").attr("disabled", true);
    $("#version").off("input").attr("disabled", true);
    $("#select_all").off("change");
    $(".country-select-all").off("change").attr("disabled", true);
    $("input[name='mirror']").off("change").attr("disabled", true);
};

const timeDifference = (downloadedAt) => {
    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(new Date().getTime() - downloadedAt);

    // Calculate the difference in days
    return Math.floor(diffInMs / (1000 * 60 * 60));
}

const renderResult = (url) => {
    $('#result').append(`
    <div class="d-flex flex-row" id="${url}">
            <button class="bg-black border border-1 btn btn-sm rounded-0 text-white copy" data="${url}">Copy to Clipboard</button>
            <textarea class="form-control" rows="1" cols="40"
                      style="resize: none ;border-bottom-left-radius: 0; border-top-left-radius: 0"
                      spellcheck="false" id="textarea-${url}" disabled>${url}</textarea>
            <div class="loader text-primary mx-3" style='flex: none' id="loader-${url}" role="status"></div>
    </div>
    `)
}

$('body').on('click', '.copy', function () {
    const copyText = document.getElementById(`textarea-${$(this).attr('data')}`);

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    alert("Copied url: " + copyText.value);
});

$('body').on('click', '#stop', function () {
    stop = true;
    speedtest.stop();
})

$('body').on('click', '#reload', function () {
    location.reload();
})
