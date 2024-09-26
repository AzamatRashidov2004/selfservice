import { GoogleLogout } from "react-google-login";

const clientId =
  "960257251812-noch3cpe8u57uomu598mtrr6phek348n.apps.googleusercontent.com";

export default function GoogleLogoutButton() {
  const onSuccess = () => {
    console.log("Log out successfull!");
  };
  return (
    <div id="GoogleSignOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}
