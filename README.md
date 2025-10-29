# Personal Portfolio

A simple personal portfolio website built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- Responsive design
- Dark mode support
- Sections for About, Skills, Projects, and Contact
- Built with modern web technologies

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

- Replace placeholder content in `src/app/page.tsx` with your personal information
- Add your avatar image to `public/avatar.jpg`
- Update project links and descriptions
- Modify styles using Tailwind CSS classes

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Dockerへのプッシュ

$ docker build -t koshikai/next-ssr:1.0.0 .

$ docker push koshikai/next-ssr:1.0.0