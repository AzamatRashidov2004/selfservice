import CUSTOM_ACTION_NAMES from "./customActionNames";

export const clearSelection = (): void => {
    const newFolderButton = document.querySelector<HTMLButtonElement>(
        `button.chonky-baseButton[title="${CUSTOM_ACTION_NAMES.clearSelection}"]`
    );
    if (newFolderButton) {
        newFolderButton.click();
    }
};