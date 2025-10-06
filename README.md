# Landemon 🎬

A modern, full-featured movie streaming platform built with Next.js. Discover, watch, and review thousands of movies with an elegant and responsive interface.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flande26%2Fmovieko&env=NEXT_PUBLIC_APP_URL,NEXT_PUBLIC_TMDB_TOKEN,NEXT_PUBLIC_SITE_NAME&envDescription=Required%20environment%20variables%20for%20Landemon&envLink=https%3A%2F%2Fgithub.com%2Flande26%2Fmovieko%23environment-variables&project-name=landemon&repository-name=landemon)

## ✨ Features

### 🎥 Movie Discovery
- **Extensive Library**: Browse thousands of movies from The Movie Database (TMDb)
- **Smart Filtering**: Sort by genre, release date, popularity, and rating
- **Advanced Search**: Find movies by title, director, cast, or keywords
- **Trending Content**: Discover what's popular right now

### 🎯 Personalized Experience
- **Recommendation Engine**: Get tailored movie suggestions based on your viewing history and preferences
- **User Ratings**: Rate movies on a 10-point scale and see community averages
- **Review System**: Write detailed reviews and read what others think

### 🎬 Streaming
- **High-Quality Playback**: Stream movies directly through integrated video sources
- **Multiple Sources**: Powered by Vidsrc.cc for reliable streaming links
- **Seamless Experience**: No redirects or external players needed

### 📱 Modern Design
- **Responsive Layout**: Perfect experience on desktop, tablet, and mobile devices
- **Fast Performance**: Optimized with Next.js for lightning-fast page loads
- **Beautiful UI**: Clean, modern interface built with Tailwind CSS

## 🚀 Quick Deploy

### Deploy with Vercel (Recommended)

Click the button below to deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flande26%2Fmovieko&env=NEXT_PUBLIC_APP_URL,NEXT_PUBLIC_TMDB_TOKEN,NEXT_PUBLIC_SITE_NAME&envDescription=Required%20environment%20variables%20for%20Landemon&envLink=https%3A%2F%2Fgithub.com%2Flande26%2Fmovieko%23environment-variables&project-name=landemon&repository-name=landemon)

**After clicking:**
1. Sign in to Vercel (or create an account)
2. The repository will be forked to your GitHub account
3. Configure the following environment variables:
   - `NEXT_PUBLIC_APP_URL`: Your deployment URL (e.g., `https://landemon.vercel.app`)
   - `NEXT_PUBLIC_TMDB_TOKEN`: Your TMDb API key ([get one here](https://www.themoviedb.org/settings/api))
   - `NEXT_PUBLIC_SITE_NAME`: `Landemon` (or customize to your preference)
4. Click "Deploy" and wait for the build to complete
5. Your movie streaming platform will be live! 🎉

### Deploy with Cloudflare Pages

For Cloudflare Pages deployment:

1. Fork this repository to your GitHub account
2. Log in to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project" → "Connect to Git"
4. Select your forked repository
5. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages@1`
   - **Build output directory**: `.vercel/output/static`
6. Add environment variables (same as Vercel)
7. Click "Save and Deploy"

For detailed Cloudflare deployment instructions, see the [Next-on-Pages documentation](https://github.com/cloudflare/next-on-pages/tree/main/packages/next-on-pages).

## 💻 Local Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- A TMDb API key ([register here](https://www.themoviedb.org/signup))

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/lande26/movieko.git
   cd movieko
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your values:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_TMDB_TOKEN=your_tmdb_api_key_here
   NEXT_PUBLIC_SITE_NAME=Landemon
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 🔑 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | The URL where your app is deployed | Yes | `https://landemon.vercel.app` |
| `NEXT_PUBLIC_TMDB_TOKEN` | Your TMDb API key for movie data | Yes | `eyJhbGc...` |
| `NEXT_PUBLIC_SITE_NAME` | Display name for your site | Yes | `Landemon` |

### Getting a TMDb API Key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to Settings → API
3. Request an API key (choose "Developer" option)
4. Copy your API Read Access Token (v4 auth)
5. Use this token as `NEXT_PUBLIC_TMDB_TOKEN`

> **Note**: A default token is available in `.env.example` for testing purposes only. For production use, always use your own API key.

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** – React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** – Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first CSS framework
- **[TMDb API](https://www.themoviedb.org/)** – Comprehensive movie database
- **[Vidsrc.cc](https://vidsrc.cc)** – Movie streaming source provider
- **[Vercel](https://vercel.com/)** – Deployment and hosting platform

## 🤝 Contributing

Contributions are welcome and appreciated! Whether it's bug fixes, feature additions, or documentation improvements, every contribution helps make Landemon better.

### How to Contribute

1. **Fork the repository**
   
   Click the "Fork" button at the top right of this page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/movieko.git
   cd movieko
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix
   ```

4. **Make your changes**
   
   Write clean, well-documented code following the project's style

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Amazing new feature"
   ```
   
   Use clear commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Remove:` for removing features or code

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   
   Go to the original repository and click "New Pull Request"

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed
- Keep PRs focused on a single feature or fix

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- **[The Movie Database (TMDb)](https://www.themoviedb.org/)** – For providing comprehensive movie data and images through their excellent API
- **[Vidsrc.cc](https://vidsrc.cc)** – For reliable movie streaming links and sources
- **Next.js Team** – For the amazing React framework
- **Vercel** – For seamless deployment and hosting
- **All Contributors** – Thank you for your contributions to making Landemon better!

## 📧 Support

If you encounter any issues or have questions:

- Open an [issue on GitHub](https://github.com/lande26/movieko/issues)
- Check existing issues for solutions
- Review the documentation

## 🌟 Star Us!

If you find Landemon useful, please consider giving it a star on GitHub! It helps others discover the project.

---

**Built with ❤️ by [lande26](https://github.com/lande26)**

**Live Demo**: [landemon.vercel.app](https://lande-mon.vercel.app) *(update with your actual URL)*
