import { db } from "@/lib/db";
import { ipinfoWrapper } from "@/lib/ip";
export const getLocationByIp = async (ip: string) => {
  const ipinfo = await ipinfoWrapper
    .lookupIp(ip)
    .catch(() => ({
      ip: "localhost",
      city: "localhost",
      country: "localhost",
    }));

  if (!ipinfo?.ip) ipinfo.ip = "localhost";
  if (!ipinfo?.city) ipinfo.city = "localhost";
  if (!ipinfo?.country) ipinfo.country = "localhost";
  return ipinfo;
};
