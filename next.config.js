/** @type {import('next').NextConfig} */

//used for the scss modules
const path = require('path');


const withTM = require("next-transpile-modules")([
  "@fullcalendar/common",
  "@babel/preset-react",
  "@fullcalendar/common",
  "@fullcalendar/daygrid",
  "@fullcalendar/interaction",
  "@fullcalendar/react",
  "@fullcalendar/timegrid"
]);


module.exports = withTM({
  // custom config goes here
  reactStrictMode: true,

  //svg support
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  //scss support
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },

  //image support
  images: {
    domains: ["ixmpfpsjhdyjnhmhjglg.supabase.co"],
  },


});


// const nextConfig = {
//   reactStrictMode: true,

//   //svg support
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       use: ["@svgr/webpack"],
//     });
//     return config;
//   },

//   //scss support
//   sassOptions: {
//     includePaths: [path.join(__dirname, "styles")],
//   },

//   //image support
//   images: {
//     domains: ["ixmpfpsjhdyjnhmhjglg.supabase.co"],
//   },
// }

// module.exports = withTM(nextConfig);