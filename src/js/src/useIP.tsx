import { useEffect, useState } from "react";

const useIP = (): string | null => {
  const [IP, setIP] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setIP(data.ip);
      });
  }, []);

  return IP;
};

export default useIP;
