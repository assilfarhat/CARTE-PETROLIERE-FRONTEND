
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
export const environment = {
  production: false,
  //api_url: 'http://localhost:57660',
 //api_url: location.origin + '/Acil',
  api_gateway_url: 'http://localhost:6004',
  accountmanagement_url: 'http://localhost:6004/accountmanagement',
  stationmanagement_url: 'http://localhost:6004/stationmanagement',
  systemsupport_url: 'http://localhost:6004/systemsupport',
  customorservice_url: 'http://localhost:6004/customorservice',
  //api_url: 'https://213.150.169.94:3443/WSPortailStarOil',
  MaxRetraitAlimentation : 9999999999,
  MinRetraitAlimentation: 1000,
  sessionTime: 15
};

