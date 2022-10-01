const fetch = require("cross-fetch");
const jsdom = require("jsdom");
const ogs = require("open-graph-scraper");
const TinyURL = require("tinyurl");

const resolvers = {
  Query: {
    records: (parent, { message }) => {
      const resObj = {};

      if (message?.includes("@")) {
        const pattern = /\@[a-z0-9_-]+/gi;
        resObj.mentions = message
          .match(pattern)
          .map((mention) => mention.slice(1));
      }

      if (message.includes("(") && message.includes(")")) {
        const bracketsRegex = /\((.*?)\)/g;
        const emoticons = [];
        let found;

        while ((found = bracketsRegex.exec(message))) {
          emoticons.push(found[1]);
        }

        resObj.emoticons = emoticons;
      }

      const getTitle = async (url) => {
        let tinyURL;
        let title;

        const options = {
          url,
          headers: {
            "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
          },
        };

        await TinyURL.shorten(url, (res) => {
          tinyURL = res;
        });

        await ogs(options, (error, { ogTitle, ogDescription }, response) => {
          if (ogTitle && ogDescription) {
            const desc = `&quot;${ogDescription.slice(
              1,
              ogDescription.split("").length - 1
            )} ${tinyURL} &quot;`;

            title = `${ogTitle}: ${desc}`;
          }
        });

        const getTitle = await fetch(`${url}`);
        const html = await getTitle.text();
        const dom = new jsdom.JSDOM(html);
        const htmlTitle = dom.window.document.title;

        return title ? title : htmlTitle;
      };

      const urlRegex = /(https?:\/\/[^ ]*)/gi;
      const urls = [];
      let fond;

      while ((fond = urlRegex.exec(message))) {
        urls.push(fond[1]);
      }

      if (urls?.length) {
        resObj.links = urls.map((url) => {
          const title = getTitle(url);

          return {
            url,
            title,
          };
        });
      }

      return resObj;
    },
  },
};

module.exports = {
  resolvers: resolvers,
};
