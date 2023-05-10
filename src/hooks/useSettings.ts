import {SettingsContext, SettingsContextValue} from "@/context/SettingsContext";
import {useContext} from "react";

export const useSettings = (): SettingsContextValue => useContext(SettingsContext)