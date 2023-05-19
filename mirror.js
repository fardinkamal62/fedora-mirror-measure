const parse = require("node-html-parser").parse;
const fetch = require("node-fetch");

const index = module.exports;

const regexes = {
  capitalLetters: /<td>[A-Z]{2}<\/td>/,
  fedoraKeyword: /^http(|s):.*(\/fedora(?!-))/,
  epelKeyword: /epel*/,
};

let mirrors = {};

index.getMirrors = async (version, archi) => {
  const site = await fetch(
    `https://admin.fedoraproject.org/mirrormanager/mirrors/Fedora/${version}/${archi}`
  );
  const html = await site.text();
  let countryCode = "";
  const parsed = parse(html);

  const td = parsed.getElementsByTagName("td");
  td.map((item) => {
    const href = item.getElementsByTagName("a");
    if (item.toString().search(regexes.capitalLetters) !== -1) {
      countryCode = item.innerHTML;
    }
    let domain = item.getElementsByTagName("a");
    if (domain.length > 0) {
      domain.map((d) => {
        if (d.getAttribute("href").search(regexes.fedoraKeyword) > -1) {
          if (d.getAttribute("href").search(regexes.epelKeyword) === -1) {
            handle_dictionary(countryCode, d.getAttribute("href"));
          }
        }
      });
    }
  });
  return mirrors;
};

const handle_dictionary = (code, link) => {
  if (code in mirrors) {
    mirrors[code].push(link);
  } else {
    mirrors[code] = [link];
  }
};
