export default {
  tenant_discovery_endpoint:
    "https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4/v2.0/.well-known/openid-configuration",
  "api-version": "1.1",
  metadata: [
    {
      preferred_network: "login.microsoftonline.com",
      preferred_cache: "login.windows.net",
      aliases: [
        "login.microsoftonline.com",
        "login.windows.net",
        "login.microsoft.com",
        "sts.windows.net"
      ]
    },
    {
      preferred_network: "login.partner.microsoftonline.cn",
      preferred_cache: "login.partner.microsoftonline.cn",
      aliases: ["login.partner.microsoftonline.cn", "login.chinacloudapi.cn"]
    },
    {
      preferred_network: "login.microsoftonline.de",
      preferred_cache: "login.microsoftonline.de",
      aliases: ["login.microsoftonline.de"]
    },
    {
      preferred_network: "login.microsoftonline.us",
      preferred_cache: "login.microsoftonline.us",
      aliases: ["login.microsoftonline.us", "login.usgovcloudapi.net"]
    },
    {
      preferred_network: "login-us.microsoftonline.com",
      preferred_cache: "login-us.microsoftonline.com",
      aliases: ["login-us.microsoftonline.com"]
    }
  ]
};
