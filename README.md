### Components

Each component has its own folder under `src/components`, containing the JSX file and its associated CSS file.

### Pages

The `pages` folder stores page components:

- `Dashboard.jsx`: Home page (equivalent to https://slf-service.web.app/pages/initialize.html?mode=edit)
- `New.jsx`: New page (equivalent to https://slf-service.web.app/pages/new.html)

## API

The `api` folder is organized by endpoints. Each endpoint has its own file with a clean fetch request function. Please maintain this style for API calls.

## Routing

Routing is set up in `App.jsx`. Make adjustments there if additional routes are needed.

## Repository

GitLab repository: https://gitlab.com/promethistai/ciirc-projects/selfservice/selfservice_react

## Assets

Store all assets (icons, images) in the `assets` folder. Prefer using SVG files for icons due to their scalability.

## Hosting

The project is set up with Firebase hosting. To deploy:

1. Accept the Firebase invitation
2. Run `firebase login`
3. Run `firebase deploy`

## Deployment

Deployment URL: https://selfservice-react.web.app/

## Development Guidelines

1. Keep components modular and reusable
2. Follow the established API call pattern
3. Use SVG icons when possible
4. Maintain clean and consistent code style
5. Update routing in `App.jsx` as needed
6. Keep assets organized in the `assets` folder

For any questions or issues, please refer to the project documentation or contact the project maintainer.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
