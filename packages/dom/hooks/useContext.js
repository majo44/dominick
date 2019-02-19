import { getGlobalContext } from "../context/globalContext.js";

export function useContext() {
    return getGlobalContext();
}
