const fs = require("fs");
const NOT_FOUND_PATH = "public/404.html";

module.exports = function(eleventyConfig) {
  //Assets passthrough
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addWatchTarget("./src/assets");

  //Layout Aliasing
  eleventyConfig.addLayoutAlias("base", "../includes/base.njk");

  //Serve Error Page
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          if (!fs.existsSync(NOT_FOUND_PATH)) {
            throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
          }

          const content_404 = fs.readFileSync(NOT_FOUND_PATH);
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  // Return your Object options:
  return {
    dir: {
      input: "src",         //Controls the top level directory/file/glob that we’ll use to look for templates.
      output: "public",     //Controls the directory inside which the finished templates will be written to.
      includes: "includes", //The includes directory is meant for Eleventy include files, extends files, partials, or macros.
      layouts: "layouts",   //The layouts directory is meant for Eleventy layouts built from files from includes, these are our final pages.
      data: "data",         //Controls the directory inside which the global data template files, available to all templates, can be found.
      assets: "assets"      //The assets directory is meant for css, images, docs, etc.
    }
  }
};