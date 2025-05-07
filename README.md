# SelfService React

Client service containing the administration console for the SelfService project.

## Project Structure

Each component has its own folder under `src/components`, containing the JSX file and its associated CSS file.

The `pages` folder stores page components:
- `Dashboard.jsx`: Home page (equivalent to https://slf-service.web.app/pages/initialize.html?mode=edit)
- `New.jsx`: New page (equivalent to https://slf-service.web.app/pages/new.html)

The `api` folder is organized by endpoints. Each endpoint has its own file with a clean fetch request function.
Please maintain this style for API calls.

Routing is set up in `App.jsx`. Make adjustments there if additional routes are needed.

Store all assets (icons, images) in the `assets` folder. Prefer using SVG files for icons due to their scalability.

## Development Guidelines

1. Keep components modular and reusable
2. Follow the established API call pattern
3. Use SVG icons when possible
4. Maintain clean and consistent code style
5. Update routing in `App.jsx` as needed
6. Keep assets organized in the `assets` folder

## Versioning Guidelines
We use X.Y.Z versioning system on the Development version

1. Use fix: some commit, to push a new version with minor fix == X.Y.Z+1
2. Use feat: some commit, to push a new version with a new feature == X.Y+1.0
3. Use feat!: some commit, to push a new version with big changes == X+1.0.0

For any questions or issues, please refer to the project documentation or contact the project maintainer.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
