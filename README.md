# SelfService React

Client service containing the administration console for the SelfService project.

## Project Structure

Each component has its own folder under `src/components`, containing the JSX file and its associated CSS file.

The `pages` folder stores page components:
- `Dashboard.jsx`: Home page (equivalent to https://slf-service.web.app/pages/initialize.html?mode=edit)
- `New.jsx`: New page (equivalent to https://slf-service.web.app/pages/new.html)

The `api` folder is organized by endpoints. Each endpoint has its own file with a clean fetch request function.
Please maintain this style for API calls.

Automatic Versioning System
This project uses automatic semantic versioning based on conventional commit messages:
How It Works

The version is stored in a .version file in the repository
Each commit to the develop branch automatically updates the version based on commit message prefix:

fix: message → increases patch version (1.2.3 → 1.2.4)
feat: message → increases minor version (1.2.3 → 1.3.0)
feat!: message or BREAKING CHANGE: message → increases major version (1.2.3 → 2.0.0)
Any other commit message → increases patch version (1.2.3 → 1.2.4)

Using Conventional Commits
To control version increments, format your commit messages as follows:
For bug fixes (patch increment):
fix: correct input validation error
For new features (minor increment):
feat: add dark mode support
For breaking changes (major increment):
feat!: completely redesign API
or
feat: new login system
BREAKING CHANGE: users need to reset passwords
Viewing the Version
The current application version is displayed in the application interface. In development, it comes from the .version file, while in production it's set during the build process.
Release Tags
For production releases, create a tag with the version number:
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3
The CI/CD pipeline will use the tag value as the version for production builds.

Routing is set up in `App.jsx`. Make adjustments there if additional routes are needed.

Store all assets (icons, images) in the `assets` folder. Prefer using SVG files for icons due to their scalability.

## Development Guidelines

1. Keep components modular and reusable
2. Follow the established API call pattern
3. Use SVG icons when possible
4. Maintain clean and consistent code style
5. Update routing in `App.jsx` as needed
6. Keep assets organized in the `assets` folder

For any questions or issues, please refer to the project documentation or contact the project maintainer.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
