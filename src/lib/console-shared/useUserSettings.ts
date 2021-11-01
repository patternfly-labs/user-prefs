// @ts-nocheck
import * as React from "react";
import { useUserSettingsLocalStorage } from "./useUserSettingsLocalStorage";
import axios from 'axios';

export const useUserSettings = <T>(
  key: string,
  defaultValue?: T,
  sync: boolean = false
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] => {
  const useRemoteStorage = localStorage.getItem('useRemoteStorage') === 'true';
  // console.log(`useRemoteStorage? ${useRemoteStorage}`)
  const [loaded, setLoaded] = React.useState(useRemoteStorage ? false : true);
  const [pref, setPref] = React.useState(null);

  const local = `http://localhost:5000/user-preferences-b2a93/us-central1/api`;
  const remote = `https://us-central1-user-preferences-b2a93.cloudfunctions.net/api`;

  React.useEffect(() => {
    if (!useRemoteStorage) {
      return;
    }
    if (loaded) {
      return;
    }
    const load = () => {
      // load user settings from remote storage
      axios
      .get(`${local}/pref/${key}`)
      .then((response) => {
        console.log(response);
        setPref(response.data.value);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
    };
    setTimeout(load, useRemoteStorage ? 3000 : 1);
  }, [loaded])

  const setRemotePref = (value) => {
    setPref(String(value));
    axios
      .post(`${local}/pref`, { key, value: String(value) })
      .then((response) => {
				console.log(`updated ${key}`);
			})
      .catch((err) => {
				console.log(err);
			});
  }

  const alwaysUseFallbackLocalStorage = true;
  const impersonate = false;
  const userUid = "kubeadmin";
  const keyRef = React.useRef<string>(key);
  const defaultValueRef = React.useRef<T>(defaultValue || null);
  // @ts-ignore
  // const [fallbackLocalStorage, setFallbackLocalStorage] = React.useState<
  //   boolean
  // >(alwaysUseFallbackLocalStorage);
  const fallbackLocalStorage = true;
  const isLocalStorage = fallbackLocalStorage || impersonate;
  
  const [lsData, setLsDataCallback] = useUserSettingsLocalStorage(
    alwaysUseFallbackLocalStorage && !impersonate
      ? "console-user-settings"
      : `console-user-settings-${userUid}`,
    keyRef.current,
    defaultValueRef.current,
    isLocalStorage && sync,
    impersonate
  );

  // return [lsData, setLsDataCallback, true];
  return useRemoteStorage ? [pref, setRemotePref, loaded] : [lsData, setLsDataCallback, true];
};
