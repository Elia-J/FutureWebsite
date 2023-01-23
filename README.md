# FutureWebsite

![GitHub repo size](https://img.shields.io/github/repo-size/Elia-J/FutureWebsite?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/Elia-J/FutureWebsite?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/Elia-J/FutureWebsite?style=for-the-badge)

![GitHub stars](https://img.shields.io/github/stars/Elia-J/FutureWebsite?style=for-the-badge)
![GitHub watchers](https://img.shields.io/github/watchers/Elia-J/FutureWebsite?style=for-the-badge)
![GitHub followers](https://img.shields.io/github/followers/Elia-J?style=for-the-badge)

![Last commit](https://img.shields.io/github/last-commit/Elia-J/FutureWebsite?style=for-the-badge)
![Vercel Deployment](https://vercelbadge.vercel.app/api/Elia-J/FutureWebsite?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/Elia-J/FutureWebsite?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Elia-J/FutureWebsite?style=for-the-badge)
</br></br>

![FutureWebsite](https://raw.githubusercontent.com/Elia-J/FutureWebsite/ff8f72cacd8b18b05f10c44ea733decf7bdfbd05/public/future-website.svg)
</br></br>

## Table of Contents

- [About](#about)
- [Libraries and Frameworks](#libraries-and-frameworks)
- [Handy Websites and Documents](#handy-websites-and-documents)
- [Installation](#installing)
- [Configuration](#configuration)
  </br>

## About

This is a Next.js web application that uses a Supabase database and is hosted on Vercel. You can view the live demo at [https://future-website.vercel.app/](https://future-website.vercel.app/).
</br></br>

## Libraries and Frameworks

- Frontend: Next.js
- Backend: Supabase (PostgreSQL)
- Hosting: Vercel
- Styling: SCSS
- Timezone: Moment.js
- Weather: OpenWeatherMap API
- Calendar: FullCalendar
- Animations: Framer Motion
- Text Editor: Slate.js
- Search: Fuse.js
- Cities Names: Country-State-City

You can find a list of the libraries used in this project in the `package.json` file.
</br></br>

## Handy Websites and Documents

- [Next.js Website](https://nextjs.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Website](https://www.supabase.io/)
- [Supabase Documentation](https://supabase.io/docs)
- [OpenAI Website](https://openai.com/)
- [OpenAI Documentation](https://beta.openai.com/docs)
- [Vercel Website](https://vercel.com/)
- [Node JS Website](https://nodejs.org/en/)
- [Git Website](https://git-scm.com/)

  </br></br>

## Installation

To install and run this project, you will need [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your computer.

You can clone the code by running the following command in your terminal:

```bash
git clone https://github.com/Elia-J/FutureWebsite.git
```

Alternatively, you can download the code using the green "Download" button on the GitHub repository, or using a Git GUI client such as [GitHub Desktop](https://desktop.github.com/) or [SourceTree](https://www.sourcetreeapp.com/).

Once you have the code downloaded, navigate to the project directory and run the following command to install the dependencies:

```bash
npm install
```

To start the development server, run:

```bash
npm run dev
```

This will start a development server and open the app in your default browser. Any changes you make to the code will be reflected in the browser in real-time.

To build the app for production, run:

```bash
npm run build
```

This will create a production-ready build of the app in the `.next` directory.

To update the dependencies, run:

```bash
npm update
```

Please note that you need to configure the enviroment variable before running the project.
</br></br>

## Configuration

To configure the project, you need to create a `.env.local` file in the root directory of the project. In this file, you need to add the following environment variables:

```bash
    // .env.local

    NEXT_PUBLIC_SUPABASE_URL= is the URL of the Supabase database.
    NEXT_PUBLIC_SUPABASE_ANON_KEY= is the anonymous key of the Supabase database.
    SERVER_ROLE_SUPABASE_KEY= is the server role key of the Supabase database.
    WEATHER_API_KEY= is the API key of the OpenWeatherMap API.

```

We will not provide the environment variables values for security reasons.
</br></br>

## Author

[Elia](https://github.com/Elia-J) , [Hugo](https://github.com/hugokrul) , [Pepijn](https://github.com/PepijnU)
