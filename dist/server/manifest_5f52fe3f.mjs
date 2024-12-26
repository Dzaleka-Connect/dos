import { trimSlashes } from '@astrojs/internal-helpers/path';
import { serialize, parse } from 'cookie';
import { bold } from 'kleur/colors';
import 'string-width';
import mime from 'mime';
import { A as AstroError, w as ResponseSentError, D as MiddlewareNoDataOrNextCalled, G as MiddlewareNotAResponse, H as GetStaticPathsRequired, J as InvalidGetStaticPathsReturn, K as InvalidGetStaticPathsEntry, N as GetStaticPathsExpectedParams, O as GetStaticPathsInvalidRouteParam, P as PageNumberParamNotFound, Q as GetStaticPathsRemovedRSSHelper, T as NoMatchingStaticPathFound, V as PrerenderDynamicEndpointPathCollide, W as LocalsNotAnObject, X as ASTRO_VERSION, C as ClientAddressNotAvailable, S as StaticClientAddressNotAvailable, Y as renderEndpoint } from './chunks/astro_80255e7d.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = Symbol.for("astro.responseSent");
class AstroCookie {
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false")
      return false;
    if (this.value === "0")
      return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const serializeOptions = {
      expires: DELETED_EXPIRATION
    };
    if (options?.domain) {
      serializeOptions.domain = options.domain;
    }
    if (options?.path) {
      serializeOptions.path = options.path;
    }
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      serialize(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      return new AstroCookie(value);
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @returns
   */
  has(key) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed();
    return !!values[key];
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      serialize(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null)
      return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  #ensureParsed() {
    if (!this.#requestValues) {
      this.#parse();
    }
    if (!this.#requestValues) {
      this.#requestValues = {};
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = parse(raw);
  }
}

const astroCookiesSymbol = Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function responseHasCookies(response) {
  return Reflect.has(response, astroCookiesSymbol);
}
function getFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of cookies.headers()) {
    yield headerValue;
  }
  return [];
}

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message
  };
  if (levels[logLevel] > levels[level]) {
    return;
  }
  dest.write(event);
}
function info(opts, label, message) {
  return log(opts, "info", label, message);
}
function warn(opts, label, message) {
  return log(opts, "warn", label, message);
}
function error(opts, label, message) {
  return log(opts, "error", label, message);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message) {
    info(this.options, label, message);
  }
  warn(label, message) {
    warn(this.options, label, message);
  }
  error(label, message) {
    error(this.options, label, message);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

async function callMiddleware(logger, onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async () => {
    nextCalled = true;
    responseFunctionPromise = responseFunction();
    return responseFunctionPromise;
  };
  let middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (isEndpointOutput(value)) {
      logger.warn(
        "middleware",
        `Using simple endpoints can cause unexpected issues in the chain of middleware functions.
It's strongly suggested to use full ${bold("Response")} objects.`
      );
    }
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return ensureCookiesAttached(apiContext, value);
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return ensureCookiesAttached(apiContext, value);
    }
  });
}
function ensureCookiesAttached(apiContext, response) {
  if (apiContext.cookies !== void 0 && !responseHasCookies(response)) {
    attachCookiesToResponse(response, apiContext.cookies);
  }
  return response;
}
function isEndpointOutput(endpointResult) {
  return !(endpointResult instanceof Response) && typeof endpointResult === "object" && typeof endpointResult.body === "string";
}

function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}

function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
function redirectRouteGenerate(redirectRoute, data) {
  const routeData = redirectRoute.redirectRoute;
  const route = redirectRoute.redirect;
  if (typeof routeData !== "undefined") {
    return routeData?.generate(data) || routeData?.pathname || "/";
  } else if (typeof route === "string") {
    return route;
  } else if (typeof route === "undefined") {
    return "/";
  }
  return route.destination;
}
function redirectRouteStatus(redirectRoute, method = "GET") {
  const routeData = redirectRoute.redirectRoute;
  if (typeof routeData?.redirect === "object") {
    return routeData.redirect.status;
  } else if (method !== "GET") {
    return 308;
  }
  return 301;
}

const VALID_PARAM_TYPES = ["string", "number", "undefined"];
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "getStaticPaths",
          `invalid path param: ${key}. A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "getStaticPaths",
          `invalid path param: ${key}. \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}

function getParams(array) {
  const fn = (match) => {
    const params = {};
    array.forEach((key, i) => {
      if (key.startsWith("...")) {
        params[key.slice(3)] = match[i + 1] ? decodeURIComponent(match[i + 1]) : void 0;
      } else {
        params[key] = decodeURIComponent(match[i + 1]);
      }
    });
    return params;
  };
  return fn;
}
function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return JSON.stringify(route.generate(validatedParams));
}

function generatePaginateFunction(routeMatch) {
  return function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = correctIndexRoute(routeMatch.generate({ ...params }));
      const next = pageNum === lastPage ? void 0 : correctIndexRoute(routeMatch.generate({ ...params, page: String(pageNum + 1) }));
      const prev = pageNum === 1 ? void 0 : correctIndexRoute(
        routeMatch.generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        })
      );
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start, end),
            start,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev }
          }
        }
      };
    });
    return result;
  };
}
function correctIndexRoute(route) {
  if (route === "") {
    return "/";
  }
  return route;
}

async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender) {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, staticPaths: entry });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route),
    rss() {
      throw new AstroError(GetStaticPathsRemovedRSSHelper);
    }
  });
  validateGetStaticPathsResult(staticPaths, logger, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
class RouteCache {
  logger;
  cache = {};
  mode;
  constructor(logger, mode = "production") {
    this.logger = logger;
    this.mode = mode;
  }
  /** Clear the cache. */
  clearAll() {
    this.cache = {};
  }
  set(route, entry) {
    if (this.mode === "production" && this.cache[route.component]?.staticPaths) {
      this.logger.warn(
        "routeCache",
        `Internal Warning: route cache overwritten. (${route.component})`
      );
    }
    this.cache[route.component] = entry;
  }
  get(route) {
    return this.cache[route.component];
  }
}
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("findPathItemByKey", `Unexpected cache miss looking for ${paramsKey}`);
}

async function getParamsAndProps(opts) {
  const { logger, mod, route, routeCache, pathname, ssr } = opts;
  if (!route || route.pathname) {
    return [{}, {}];
  }
  const params = getRouteParams(route, pathname) ?? {};
  if (routeIsRedirect(route) || routeIsFallback(route)) {
    return [params, {}];
  }
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    logger,
    ssr
  });
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
  if (!matchedStaticPath && (ssr ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return [params, props];
}
function getRouteParams(route, pathname) {
  if (route.params.length) {
    const paramsMatch = route.pattern.exec(decodeURIComponent(pathname));
    if (paramsMatch) {
      return getParams(route.params)(paramsMatch);
    }
  }
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}

const clientLocalsSymbol$1 = Symbol.for("astro.locals");
async function createRenderContext(options) {
  const request = options.request;
  const pathname = options.pathname ?? new URL(request.url).pathname;
  const [params, props] = await getParamsAndProps({
    mod: options.mod,
    route: options.route,
    routeCache: options.env.routeCache,
    pathname,
    logger: options.env.logger,
    ssr: options.env.ssr
  });
  const context = {
    ...options,
    pathname,
    params,
    props,
    locales: options.locales,
    routing: options.routing,
    defaultLocale: options.defaultLocale
  };
  Object.defineProperty(context, "locals", {
    enumerable: true,
    get() {
      return Reflect.get(request, clientLocalsSymbol$1);
    },
    set(val) {
      if (typeof val !== "object") {
        throw new AstroError(LocalsNotAnObject);
      } else {
        Reflect.set(request, clientLocalsSymbol$1, val);
      }
    }
  });
  return context;
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = locales.map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      if (a.qualityValue > b.qualityValue) {
        return -1;
      } else if (a.qualityValue < b.qualityValue) {
        return 1;
      }
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult) {
      if (firstResult.locale !== "*") {
        result = locales.find(
          (locale) => normalizeTheLocale(locale) === normalizeTheLocale(firstResult.locale)
        );
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return locales;
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        const found = locales.find(
          (l) => normalizeTheLocale(l) === normalizeTheLocale(browserLocale.locale)
        );
        if (found) {
          result.push(found);
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(request, locales, routingStrategy, defaultLocale) {
  const requestUrl = new URL(request.url);
  for (const segment of requestUrl.pathname.split("/")) {
    for (const locale of locales) {
      if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
        return locale;
      }
    }
  }
  if (routingStrategy === "prefix-other-locales") {
    return defaultLocale;
  }
  return void 0;
}

const encoder = new TextEncoder();
const clientAddressSymbol = Symbol.for("astro.clientAddress");
const clientLocalsSymbol = Symbol.for("astro.locals");
function createAPIContext({
  request,
  params,
  site,
  props,
  adapterName,
  locales,
  routingStrategy,
  defaultLocale
}) {
  let preferredLocale = void 0;
  let preferredLocaleList = void 0;
  let currentLocale = void 0;
  const context = {
    cookies: new AstroCookies(request),
    request,
    params,
    site: site ? new URL(site) : void 0,
    generator: `Astro v${ASTRO_VERSION}`,
    props,
    redirect(path, status) {
      return new Response(null, {
        status: status || 302,
        headers: {
          Location: path
        }
      });
    },
    ResponseWithEncoding,
    get preferredLocale() {
      if (preferredLocale) {
        return preferredLocale;
      }
      if (locales) {
        preferredLocale = computePreferredLocale(request, locales);
        return preferredLocale;
      }
      return void 0;
    },
    get preferredLocaleList() {
      if (preferredLocaleList) {
        return preferredLocaleList;
      }
      if (locales) {
        preferredLocaleList = computePreferredLocaleList(request, locales);
        return preferredLocaleList;
      }
      return void 0;
    },
    get currentLocale() {
      if (currentLocale) {
        return currentLocale;
      }
      if (locales) {
        currentLocale = computeCurrentLocale(request, locales, routingStrategy, defaultLocale);
      }
      return currentLocale;
    },
    url: new URL(request.url),
    get clientAddress() {
      if (clientAddressSymbol in request) {
        return Reflect.get(request, clientAddressSymbol);
      }
      if (adapterName) {
        throw new AstroError({
          ...ClientAddressNotAvailable,
          message: ClientAddressNotAvailable.message(adapterName)
        });
      } else {
        throw new AstroError(StaticClientAddressNotAvailable);
      }
    },
    get locals() {
      let locals = Reflect.get(request, clientLocalsSymbol);
      if (locals === void 0) {
        locals = {};
        Reflect.set(request, clientLocalsSymbol, locals);
      }
      if (typeof locals !== "object") {
        throw new AstroError(LocalsNotAnObject);
      }
      return locals;
    },
    // We define a custom property, so we can check the value passed to locals
    set locals(val) {
      if (typeof val !== "object") {
        throw new AstroError(LocalsNotAnObject);
      } else {
        Reflect.set(request, clientLocalsSymbol, val);
      }
    }
  };
  return context;
}
class ResponseWithEncoding extends Response {
  constructor(body, init, encoding) {
    if (typeof body === "string") {
      if (typeof Buffer !== "undefined" && Buffer.from) {
        body = Buffer.from(body, encoding);
      } else if (encoding == null || encoding === "utf8" || encoding === "utf-8") {
        body = encoder.encode(body);
      }
    }
    super(body, init);
    if (encoding) {
      this.headers.set("X-Astro-Encoding", encoding);
    }
  }
}
async function callEndpoint(mod, env, ctx, onRequest) {
  const context = createAPIContext({
    request: ctx.request,
    params: ctx.params,
    props: ctx.props,
    site: env.site,
    adapterName: env.adapterName,
    routingStrategy: ctx.routing,
    defaultLocale: ctx.defaultLocale,
    locales: ctx.locales
  });
  let response;
  if (onRequest) {
    response = await callMiddleware(
      env.logger,
      onRequest,
      context,
      async () => {
        return await renderEndpoint(mod, context, env.ssr, env.logger);
      }
    );
  } else {
    response = await renderEndpoint(mod, context, env.ssr, env.logger);
  }
  const isEndpointSSR = env.ssr && !ctx.route?.prerender;
  if (response instanceof Response) {
    if (isEndpointSSR && response.headers.get("X-Astro-Encoding")) {
      env.logger.warn(
        "ssr",
        "`ResponseWithEncoding` is ignored in SSR. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
    attachCookiesToResponse(response, context.cookies);
    return response;
  }
  env.logger.warn(
    "astro",
    `${ctx.route.component} returns a simple object which is deprecated. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information.`
  );
  if (isEndpointSSR) {
    if (response.hasOwnProperty("headers")) {
      env.logger.warn(
        "ssr",
        "Setting headers is not supported when returning an object. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
    if (response.encoding) {
      env.logger.warn(
        "ssr",
        "`encoding` is ignored in SSR. To return a charset other than UTF-8, please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
  }
  let body;
  const headers = new Headers();
  const pathname = ctx.route ? (
    // Try the static route `pathname`
    ctx.route.pathname ?? // Dynamic routes don't include `pathname`, so synthesize a path for these (e.g. 'src/pages/[slug].svg')
    ctx.route.segments.map((s) => s.map((p) => p.content).join("")).join("/")
  ) : (
    // Fallback to pathname of the request
    ctx.pathname
  );
  const mimeType = mime.getType(pathname) || "text/plain";
  headers.set("Content-Type", `${mimeType};charset=utf-8`);
  if (response.encoding) {
    headers.set("X-Astro-Encoding", response.encoding);
  }
  if (response.body instanceof Uint8Array) {
    body = response.body;
    headers.set("Content-Length", body.byteLength.toString());
  } else if (typeof Buffer !== "undefined" && Buffer.from) {
    body = Buffer.from(response.body, response.encoding);
    headers.set("Content-Length", body.byteLength.toString());
  } else if (response.encoding == null || response.encoding === "utf8" || response.encoding === "utf-8") {
    body = encoder.encode(response.body);
    headers.set("Content-Length", body.byteLength.toString());
  } else {
    body = response.body;
  }
  response = new Response(body, {
    status: 200,
    headers
  });
  attachCookiesToResponse(response, context.cookies);
  return response;
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    })
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.9f90bd38.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/test-event-submission","type":"page","pattern":"^\\/test-event-submission\\/?$","segments":[[{"content":"test-event-submission","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/test-event-submission.astro","pathname":"/test-event-submission","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/photo-gallery","type":"page","pattern":"^\\/photo-gallery\\/?$","segments":[[{"content":"photo-gallery","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/photo-gallery.astro","pathname":"/photo-gallery","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.c7b0b697.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/resources","type":"page","pattern":"^\\/resources\\/?$","segments":[[{"content":"resources","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/resources/index.astro","pathname":"/resources","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.c7b0b697.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/resources/[page]","type":"page","pattern":"^\\/resources\\/([^/]+?)\\/?$","segments":[[{"content":"resources","dynamic":false,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["page"],"component":"src/pages/resources/[page].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.c7b0b697.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/resources/[...page]","type":"page","pattern":"^\\/resources(?:\\/(.*?))?\\/?$","segments":[[{"content":"resources","dynamic":false,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...page"],"component":"src/pages/resources/[...page].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/services","type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/index.astro","pathname":"/services","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.291a29a9.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/services/register","type":"page","pattern":"^\\/services\\/register\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/register.astro","pathname":"/services/register","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/services/[...slug]","type":"page","pattern":"^\\/services(?:\\/(.*?))?\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/services/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/services/[...page]","type":"page","pattern":"^\\/services(?:\\/(.*?))?\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...page"],"component":"src/pages/services/[...page].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.235f185b.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"},{"type":"inline","content":"@media print{nav[data-astro-cid-fb3qbcs3],button[data-astro-cid-fb3qbcs3]{display:none}.prose[data-astro-cid-fb3qbcs3]{max-width:none}}\n"}],"routeData":{"route":"/privacy","type":"page","pattern":"^\\/privacy\\/?$","segments":[[{"content":"privacy","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/privacy.astro","pathname":"/privacy","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.2d585e0d.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/support","type":"page","pattern":"^\\/support\\/?$","segments":[[{"content":"support","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/support.astro","pathname":"/support","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.c7b0b697.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/events","type":"page","pattern":"^\\/events\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/events/index.astro","pathname":"/events","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.2f7d53e1.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/events/organize","type":"page","pattern":"^\\/events\\/organize\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}],[{"content":"organize","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/events/organize.astro","pathname":"/events/organize","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.c7b0b697.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/events/[type]/[page]","type":"page","pattern":"^\\/events\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}],[{"content":"type","dynamic":true,"spread":false}],[{"content":"page","dynamic":true,"spread":false}]],"params":["type","page"],"component":"src/pages/events/[type]/[page].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/events/[...slug]","type":"page","pattern":"^\\/events(?:\\/(.*?))?\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/events/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.c7b0b697.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/events/[...page]","type":"page","pattern":"^\\/events(?:\\/(.*?))?\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}],[{"content":"...page","dynamic":true,"spread":true}]],"params":["...page"],"component":"src/pages/events/[...page].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/events","type":"page","pattern":"^\\/events\\/?$","segments":[[{"content":"events","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/events.astro","pathname":"/events","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/photos","type":"page","pattern":"^\\/photos\\/?$","segments":[[{"content":"photos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/photos/index.astro","pathname":"/photos","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/photos/[year]","type":"page","pattern":"^\\/photos\\/([^/]+?)\\/?$","segments":[[{"content":"photos","dynamic":false,"spread":false}],[{"content":"year","dynamic":true,"spread":false}]],"params":["year"],"component":"src/pages/photos/[year].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/photos/[...slug]","type":"page","pattern":"^\\/photos(?:\\/(.*?))?\\/?$","segments":[[{"content":"photos","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/photos/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/search/results","type":"page","pattern":"^\\/search\\/results\\/?$","segments":[[{"content":"search","dynamic":false,"spread":false}],[{"content":"results","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/search/results.astro","pathname":"/search/results","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/search","type":"page","pattern":"^\\/search\\/?$","segments":[[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/search.astro","pathname":"/search","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/about","type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"},{"type":"external","src":"/_astro/_slug_.7f397aac.css"}],"routeData":{"route":"/docs","type":"page","pattern":"^\\/docs\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs/index.astro","pathname":"/docs","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"},{"type":"external","src":"/_astro/_slug_.7f397aac.css"}],"routeData":{"route":"/docs/[slug]","type":"page","pattern":"^\\/docs\\/([^/]+?)\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/docs/[slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/news","type":"page","pattern":"^\\/news\\/?$","segments":[[{"content":"news","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/news/index.astro","pathname":"/news","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/news/[...slug]","type":"page","pattern":"^\\/news(?:\\/(.*?))?\\/?$","segments":[[{"content":"news","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/news/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/events","type":"endpoint","pattern":"^\\/api\\/events$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"events","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/events.ts","pathname":"/api/events","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/test","type":"endpoint","pattern":"^\\/api\\/test$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/test.ts","pathname":"/api/test","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.42cdea16.js"}],"styles":[{"type":"external","src":"/_astro/_slug_.826a85bb.css"}],"routeData":{"route":"/[...slug]","type":"page","pattern":"^(?:\\/(.*?))?\\/?$","segments":[[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/components/docs/DocsSidebar.astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/docs/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/docs/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/docs/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/docs/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/events@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/events/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/events/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/[type]/[page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/events/[type]/[page]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/events/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/news/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/news/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/news/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/news/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photo-gallery.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/photo-gallery@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photos/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/photos/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photos/[year].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/photos/[year]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/photos/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/photos/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/resources/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/[page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/resources/[page]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/resources/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/resources/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/search.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/search@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/search/results.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/search/results@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/[...page].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/services/[...page]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/services/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/services/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/events/organize.astro",{"propagation":"none","containsHead":true}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/privacy.astro",{"propagation":"none","containsHead":true}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/services/register.astro",{"propagation":"none","containsHead":true}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/support.astro",{"propagation":"none","containsHead":true}],["/Users/bakari/Downloads/dzaleka heritage archive/src/pages/test-event-submission.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,s)=>{let n=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),n();break}});for(let e of s.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/src/pages/photos/[year].astro":"chunks/pages/_year__f5fef15f.mjs","/src/pages/about.astro":"chunks/pages/about_720c5b1f.mjs","/src/pages/contact.astro":"chunks/pages/contact_2277e938.mjs","/src/pages/events.astro":"chunks/pages/events_f796a2dc.mjs","/src/pages/api/events.ts":"chunks/pages/events_58d8d83a.mjs","/node_modules/astro/dist/assets/endpoint/node.js":"chunks/pages/node_3c9069d4.mjs","/src/pages/events/organize.astro":"chunks/pages/organize_c898c833.mjs","/src/pages/photo-gallery.astro":"chunks/pages/photo-gallery_ffdad575.mjs","/src/pages/privacy.astro":"chunks/pages/privacy_9e1c7174.mjs","/src/pages/services/register.astro":"chunks/pages/register_c5f66de6.mjs","/src/pages/search/results.astro":"chunks/pages/results_5de32238.mjs","/src/pages/search.astro":"chunks/pages/search_ccae5ce3.mjs","/src/pages/support.astro":"chunks/pages/support_ae70afbd.mjs","/src/pages/test-event-submission.astro":"chunks/pages/test-event-submission_e85836a4.mjs","/src/pages/api/test.ts":"chunks/pages/test_39d56077.mjs","\u0000@astrojs-manifest":"manifest_5f52fe3f.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"chunks/node_d8611a0d.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_c1b4a7d9.mjs","\u0000@astro-page:src/pages/test-event-submission@_@astro":"chunks/test-event-submission_8be187f1.mjs","\u0000@astro-page:src/pages/photo-gallery@_@astro":"chunks/photo-gallery_744c660f.mjs","\u0000@astro-page:src/pages/resources/index@_@astro":"chunks/index_45b25947.mjs","\u0000@astro-page:src/pages/resources/[page]@_@astro":"chunks/_page__394c1239.mjs","\u0000@astro-page:src/pages/resources/[...page]@_@astro":"chunks/_.._29db8f12.mjs","\u0000@astro-page:src/pages/services/index@_@astro":"chunks/index_19941e47.mjs","\u0000@astro-page:src/pages/services/register@_@astro":"chunks/register_c797a496.mjs","\u0000@astro-page:src/pages/services/[...slug]@_@astro":"chunks/_.._712cac6a.mjs","\u0000@astro-page:src/pages/services/[...page]@_@astro":"chunks/_.._c1870d32.mjs","\u0000@astro-page:src/pages/contact@_@astro":"chunks/contact_a4c76555.mjs","\u0000@astro-page:src/pages/privacy@_@astro":"chunks/privacy_257d3444.mjs","\u0000@astro-page:src/pages/support@_@astro":"chunks/support_f31b2e0d.mjs","\u0000@astro-page:src/pages/events/index@_@astro":"chunks/index_38491194.mjs","\u0000@astro-page:src/pages/events/organize@_@astro":"chunks/organize_2b50dbe6.mjs","\u0000@astro-page:src/pages/events/[type]/[page]@_@astro":"chunks/_page__d58e577a.mjs","\u0000@astro-page:src/pages/events/[...slug]@_@astro":"chunks/_.._7581e905.mjs","\u0000@astro-page:src/pages/events/[...page]@_@astro":"chunks/_.._a826f711.mjs","\u0000@astro-page:src/pages/events@_@astro":"chunks/events_aba6d8c4.mjs","\u0000@astro-page:src/pages/photos/index@_@astro":"chunks/index_bbcb0eca.mjs","\u0000@astro-page:src/pages/photos/[year]@_@astro":"chunks/_year__54ed5f60.mjs","\u0000@astro-page:src/pages/photos/[...slug]@_@astro":"chunks/_.._ab378d2d.mjs","\u0000@astro-page:src/pages/search/results@_@astro":"chunks/results_b62a0740.mjs","\u0000@astro-page:src/pages/search@_@astro":"chunks/search_8aac6315.mjs","\u0000@astro-page:src/pages/about@_@astro":"chunks/about_cafd8065.mjs","\u0000@astro-page:src/pages/docs/index@_@astro":"chunks/index_587fd89d.mjs","\u0000@astro-page:src/pages/docs/[slug]@_@astro":"chunks/_slug__31acd6ac.mjs","\u0000@astro-page:src/pages/news/index@_@astro":"chunks/index_29a7d310.mjs","\u0000@astro-page:src/pages/news/[...slug]@_@astro":"chunks/_.._1e1f20ad.mjs","\u0000@astro-page:src/pages/api/events@_@ts":"chunks/events_23865794.mjs","\u0000@astro-page:src/pages/api/test@_@ts":"chunks/test_387c4d97.mjs","\u0000@astro-page:src/pages/[...slug]@_@astro":"chunks/_.._c2ec48e6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/events-guide.md?astroContentCollectionEntry=true":"chunks/events-guide_89555960.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/getting-started.md?astroContentCollectionEntry=true":"chunks/getting-started_aa65873e.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/photo-archive.md?astroContentCollectionEntry=true":"chunks/photo-archive_48d9a997.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/resources-guide.md?astroContentCollectionEntry=true":"chunks/resources-guide_9e46440c.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/services-directory.md?astroContentCollectionEntry=true":"chunks/services-directory_48645d20.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/services-guide.md?astroContentCollectionEntry=true":"chunks/services-guide_b9536504.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/art-exhibition-2024.md?astroContentCollectionEntry=true":"chunks/art-exhibition-2024_12424c49.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/cultural-dance-showcase.md?astroContentCollectionEntry=true":"chunks/cultural-dance-showcase_5e8ee7bf.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/tumaini-festival-2023.md?astroContentCollectionEntry=true":"chunks/tumaini-festival-2023_2e7685f0.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/world-refugee-day-2023.md?astroContentCollectionEntry=true":"chunks/world-refugee-day-2023_27bcaa84.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/youth-empowerment-workshop-2024.md?astroContentCollectionEntry=true":"chunks/youth-empowerment-workshop-2024_a5c5e00c.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/youth-tech-workshop-2024.md?astroContentCollectionEntry=true":"chunks/youth-tech-workshop-2024_09045503.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/community-center-renovation.md?astroContentCollectionEntry=true":"chunks/community-center-renovation_0f43fd9c.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/dzaleka-artisans-cooperative-launch.md?astroContentCollectionEntry=true":"chunks/dzaleka-artisans-cooperative-launch_34feed32.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/tech-startup-success.md?astroContentCollectionEntry=true":"chunks/tech-startup-success_dc2c5d04.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/about.md?astroContentCollectionEntry=true":"chunks/about_010bca21.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/events.md?astroContentCollectionEntry=true":"chunks/events_456c3fbf.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/home.md?astroContentCollectionEntry=true":"chunks/home_1f123a19.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/virtual-tours.md?astroContentCollectionEntry=true":"chunks/virtual-tours_a0747d27.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Andy.md?astroContentCollectionEntry=true":"chunks/Andy_7c98b96f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Junior-Mafia.md?astroContentCollectionEntry=true":"chunks/Junior-Mafia_16f607d3.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/La-Pearl-DJ.md?astroContentCollectionEntry=true":"chunks/La-Pearl-DJ_069f26bc.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Learning-Against-All-Odds.md?astroContentCollectionEntry=true":"chunks/Learning-Against-All-Odds_57be9a76.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Obadiah.md?astroContentCollectionEntry=true":"chunks/Obadiah_cc96bc12.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Raymond.md?astroContentCollectionEntry=true":"chunks/Raymond_4256f5bd.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Surviving-in-Dzaleka.md?astroContentCollectionEntry=true":"chunks/Surviving-in-Dzaleka_e76e1399.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/a-man-collecting-cardboard.md?astroContentCollectionEntry=true":"chunks/a-man-collecting-cardboard_4f80ce24.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/building-hope.md?astroContentCollectionEntry=true":"chunks/building-hope_9bc50d82.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/struggling-to-feed-a-community.md?astroContentCollectionEntry=true":"chunks/struggling-to-feed-a-community_e61b60ea.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/tumaini-festival-2023.md?astroContentCollectionEntry=true":"chunks/tumaini-festival-2023_6299ffc9.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/business-plan-template.md?astroContentCollectionEntry=true":"chunks/business-plan-template_70f5a263.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/cv-writing-guide.md?astroContentCollectionEntry=true":"chunks/cv-writing-guide_efb37693.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/digital-marketing-course.md?astroContentCollectionEntry=true":"chunks/digital-marketing-course_2f4cb242.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/glimpse-into-dzaleka-life.md?astroContentCollectionEntry=true":"chunks/glimpse-into-dzaleka-life_2df0244e.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/malawi-refugee-guide.md?astroContentCollectionEntry=true":"chunks/malawi-refugee-guide_2cf5ea1d.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md?astroContentCollectionEntry=true":"chunks/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects_bb1d915c.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/research-report-refugee-relocation-intentions.md?astroContentCollectionEntry=true":"chunks/research-report-refugee-relocation-intentions_ea69f0bc.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/tumaini-impact-2019.md?astroContentCollectionEntry=true":"chunks/tumaini-impact-2019_36d23b69.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/tumaini-impact-2020.md?astroContentCollectionEntry=true":"chunks/tumaini-impact-2020_88468882.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/adai-circle.md?astroContentCollectionEntry=true":"chunks/adai-circle_7788d9ce.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-art-project.md?astroContentCollectionEntry=true":"chunks/dzaleka-art-project_1be431d6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-blood-donors-services.md?astroContentCollectionEntry=true":"chunks/dzaleka-blood-donors-services_62cb8bd4.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-community-radio.md?astroContentCollectionEntry=true":"chunks/dzaleka-community-radio_0d2e2f58.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-connect.md?astroContentCollectionEntry=true":"chunks/dzaleka-connect_b07769d3.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-digital-heritage.md?astroContentCollectionEntry=true":"chunks/dzaleka-digital-heritage_472a1dbf.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-rising.md?astroContentCollectionEntry=true":"chunks/dzaleka-rising_4b072dc4.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-watch.md?astroContentCollectionEntry=true":"chunks/dzaleka-watch_dad97865.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-youth-organization.md?astroContentCollectionEntry=true":"chunks/dzaleka-youth-organization_ddf71fdf.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/fountain-of-hope-africa.md?astroContentCollectionEntry=true":"chunks/fountain-of-hope-africa_c5bdef3e.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/fraternity-without-borders.md?astroContentCollectionEntry=true":"chunks/fraternity-without-borders_687204a7.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/inside-dzaleka.md?astroContentCollectionEntry=true":"chunks/inside-dzaleka_ba4534f1.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/inua-advocacy.md?astroContentCollectionEntry=true":"chunks/inua-advocacy_91f14996.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/jesuit-worldwide-learning.md?astroContentCollectionEntry=true":"chunks/jesuit-worldwide-learning_4c4570f0.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/jrs-malawi.md?astroContentCollectionEntry=true":"chunks/jrs-malawi_89d97148.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/kibebe.md?astroContentCollectionEntry=true":"chunks/kibebe_0acb3a79.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/plan-international-malawi.md?astroContentCollectionEntry=true":"chunks/plan-international-malawi_f3c5156f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/refugee-led-organisation-network-malawi.md?astroContentCollectionEntry=true":"chunks/refugee-led-organisation-network-malawi_8a4f21e2.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/rock-your-world.md?astroContentCollectionEntry=true":"chunks/rock-your-world_defd1895.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/salama-africa.md?astroContentCollectionEntry=true":"chunks/salama-africa_8770ade8.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/takenolab.md?astroContentCollectionEntry=true":"chunks/takenolab_ed14602b.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/there-is-hope-malawi.md?astroContentCollectionEntry=true":"chunks/there-is-hope-malawi_4290daae.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/tumaini-festival.md?astroContentCollectionEntry=true":"chunks/tumaini-festival_cbf3bec3.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/tumaini-letu.md?astroContentCollectionEntry=true":"chunks/tumaini-letu_20cf8002.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/umoja-hand-craft-project.md?astroContentCollectionEntry=true":"chunks/umoja-hand-craft-project_8832f561.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/unhcr-malawi.md?astroContentCollectionEntry=true":"chunks/unhcr-malawi_8551c533.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/vijanafrica.md?astroContentCollectionEntry=true":"chunks/vijanafrica_0313215a.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/village-book-builders.md?astroContentCollectionEntry=true":"chunks/village-book-builders_a3f34c3c.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/world-food-programme.md?astroContentCollectionEntry=true":"chunks/world-food-programme_dbba16d3.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/wusc-malawi.md?astroContentCollectionEntry=true":"chunks/wusc-malawi_ecaa949d.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/zawadie-solutions.md?astroContentCollectionEntry=true":"chunks/zawadie-solutions_771982e5.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/events-guide.md?astroPropagatedAssets":"chunks/events-guide_10ea6a09.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/getting-started.md?astroPropagatedAssets":"chunks/getting-started_fddf4b1d.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/photo-archive.md?astroPropagatedAssets":"chunks/photo-archive_bb7d8890.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/resources-guide.md?astroPropagatedAssets":"chunks/resources-guide_ebd4431d.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/services-directory.md?astroPropagatedAssets":"chunks/services-directory_8a2ae296.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/services-guide.md?astroPropagatedAssets":"chunks/services-guide_7fe48b11.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/art-exhibition-2024.md?astroPropagatedAssets":"chunks/art-exhibition-2024_0cff9158.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/cultural-dance-showcase.md?astroPropagatedAssets":"chunks/cultural-dance-showcase_b33fa393.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/tumaini-festival-2023.md?astroPropagatedAssets":"chunks/tumaini-festival-2023_a79e83ed.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/world-refugee-day-2023.md?astroPropagatedAssets":"chunks/world-refugee-day-2023_b7c314b7.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/youth-empowerment-workshop-2024.md?astroPropagatedAssets":"chunks/youth-empowerment-workshop-2024_f889099f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/youth-tech-workshop-2024.md?astroPropagatedAssets":"chunks/youth-tech-workshop-2024_bc99cc4d.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/community-center-renovation.md?astroPropagatedAssets":"chunks/community-center-renovation_85bcce4f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/dzaleka-artisans-cooperative-launch.md?astroPropagatedAssets":"chunks/dzaleka-artisans-cooperative-launch_7a67eaa7.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/tech-startup-success.md?astroPropagatedAssets":"chunks/tech-startup-success_32e059a9.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/about.md?astroPropagatedAssets":"chunks/about_ebccf0b3.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/events.md?astroPropagatedAssets":"chunks/events_5aafdcac.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/home.md?astroPropagatedAssets":"chunks/home_75f377c6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/virtual-tours.md?astroPropagatedAssets":"chunks/virtual-tours_4a8a8253.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Andy.md?astroPropagatedAssets":"chunks/Andy_8fcceeda.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Junior-Mafia.md?astroPropagatedAssets":"chunks/Junior-Mafia_3087931c.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/La-Pearl-DJ.md?astroPropagatedAssets":"chunks/La-Pearl-DJ_cfdd2734.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Learning-Against-All-Odds.md?astroPropagatedAssets":"chunks/Learning-Against-All-Odds_954d6939.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Obadiah.md?astroPropagatedAssets":"chunks/Obadiah_75401e0a.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Raymond.md?astroPropagatedAssets":"chunks/Raymond_8f9459ab.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Surviving-in-Dzaleka.md?astroPropagatedAssets":"chunks/Surviving-in-Dzaleka_f545ee33.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/a-man-collecting-cardboard.md?astroPropagatedAssets":"chunks/a-man-collecting-cardboard_790b939f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/building-hope.md?astroPropagatedAssets":"chunks/building-hope_02465477.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/struggling-to-feed-a-community.md?astroPropagatedAssets":"chunks/struggling-to-feed-a-community_48b64ee4.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/tumaini-festival-2023.md?astroPropagatedAssets":"chunks/tumaini-festival-2023_db19b31c.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/business-plan-template.md?astroPropagatedAssets":"chunks/business-plan-template_a9315b97.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/cv-writing-guide.md?astroPropagatedAssets":"chunks/cv-writing-guide_7d506a1c.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/digital-marketing-course.md?astroPropagatedAssets":"chunks/digital-marketing-course_722c4631.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/glimpse-into-dzaleka-life.md?astroPropagatedAssets":"chunks/glimpse-into-dzaleka-life_299d24c5.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/malawi-refugee-guide.md?astroPropagatedAssets":"chunks/malawi-refugee-guide_96f729db.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md?astroPropagatedAssets":"chunks/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects_26bcfb80.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/research-report-refugee-relocation-intentions.md?astroPropagatedAssets":"chunks/research-report-refugee-relocation-intentions_8f9be1c6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/tumaini-impact-2019.md?astroPropagatedAssets":"chunks/tumaini-impact-2019_4e89b1b1.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/tumaini-impact-2020.md?astroPropagatedAssets":"chunks/tumaini-impact-2020_74e4a2cf.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/adai-circle.md?astroPropagatedAssets":"chunks/adai-circle_8a41c656.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-art-project.md?astroPropagatedAssets":"chunks/dzaleka-art-project_a5a3df0a.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-blood-donors-services.md?astroPropagatedAssets":"chunks/dzaleka-blood-donors-services_100e3ace.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-community-radio.md?astroPropagatedAssets":"chunks/dzaleka-community-radio_2d310ab6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-connect.md?astroPropagatedAssets":"chunks/dzaleka-connect_6d820c95.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-digital-heritage.md?astroPropagatedAssets":"chunks/dzaleka-digital-heritage_ad3d697a.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-rising.md?astroPropagatedAssets":"chunks/dzaleka-rising_86940739.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-watch.md?astroPropagatedAssets":"chunks/dzaleka-watch_b80a2711.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-youth-organization.md?astroPropagatedAssets":"chunks/dzaleka-youth-organization_b8376b0d.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/fountain-of-hope-africa.md?astroPropagatedAssets":"chunks/fountain-of-hope-africa_1a98addf.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/fraternity-without-borders.md?astroPropagatedAssets":"chunks/fraternity-without-borders_ea3ed940.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/inside-dzaleka.md?astroPropagatedAssets":"chunks/inside-dzaleka_edce176b.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/inua-advocacy.md?astroPropagatedAssets":"chunks/inua-advocacy_1ae9a45f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/jesuit-worldwide-learning.md?astroPropagatedAssets":"chunks/jesuit-worldwide-learning_f37c24bf.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/jrs-malawi.md?astroPropagatedAssets":"chunks/jrs-malawi_a78625aa.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/kibebe.md?astroPropagatedAssets":"chunks/kibebe_ea1a6965.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/plan-international-malawi.md?astroPropagatedAssets":"chunks/plan-international-malawi_0ce15083.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/refugee-led-organisation-network-malawi.md?astroPropagatedAssets":"chunks/refugee-led-organisation-network-malawi_f6fbe516.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/rock-your-world.md?astroPropagatedAssets":"chunks/rock-your-world_f9fa109b.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/salama-africa.md?astroPropagatedAssets":"chunks/salama-africa_e3f07473.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/takenolab.md?astroPropagatedAssets":"chunks/takenolab_54246605.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/there-is-hope-malawi.md?astroPropagatedAssets":"chunks/there-is-hope-malawi_113a90d8.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/tumaini-festival.md?astroPropagatedAssets":"chunks/tumaini-festival_27a3d6ac.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/tumaini-letu.md?astroPropagatedAssets":"chunks/tumaini-letu_49e540b2.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/umoja-hand-craft-project.md?astroPropagatedAssets":"chunks/umoja-hand-craft-project_23593136.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/unhcr-malawi.md?astroPropagatedAssets":"chunks/unhcr-malawi_f074f093.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/vijanafrica.md?astroPropagatedAssets":"chunks/vijanafrica_16639e1f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/village-book-builders.md?astroPropagatedAssets":"chunks/village-book-builders_afa3d139.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/world-food-programme.md?astroPropagatedAssets":"chunks/world-food-programme_545c2614.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/wusc-malawi.md?astroPropagatedAssets":"chunks/wusc-malawi_d85c9ae3.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/zawadie-solutions.md?astroPropagatedAssets":"chunks/zawadie-solutions_9a3dd081.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/events-guide.md":"chunks/events-guide_c590ed2f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/getting-started.md":"chunks/getting-started_e409edc6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/photo-archive.md":"chunks/photo-archive_265cb7cf.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/resources-guide.md":"chunks/resources-guide_4bcb8854.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/services-directory.md":"chunks/services-directory_a19811f4.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/docs/services-guide.md":"chunks/services-guide_dc36d3f7.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/art-exhibition-2024.md":"chunks/art-exhibition-2024_017a5aa0.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/cultural-dance-showcase.md":"chunks/cultural-dance-showcase_03a94245.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/tumaini-festival-2023.md":"chunks/tumaini-festival-2023_72094421.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/world-refugee-day-2023.md":"chunks/world-refugee-day-2023_51d41bc8.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/youth-empowerment-workshop-2024.md":"chunks/youth-empowerment-workshop-2024_865e5b65.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/events/youth-tech-workshop-2024.md":"chunks/youth-tech-workshop-2024_78062d0e.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/community-center-renovation.md":"chunks/community-center-renovation_6010fa3a.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/dzaleka-artisans-cooperative-launch.md":"chunks/dzaleka-artisans-cooperative-launch_2a5e48d6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/news/tech-startup-success.md":"chunks/tech-startup-success_755660c0.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/about.md":"chunks/about_a5b72f95.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/events.md":"chunks/events_28646029.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/home.md":"chunks/home_fc8ac226.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/pages/virtual-tours.md":"chunks/virtual-tours_6e30efe2.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Andy.md":"chunks/Andy_aa6708f4.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Junior-Mafia.md":"chunks/Junior-Mafia_8076b40e.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/La-Pearl-DJ.md":"chunks/La-Pearl-DJ_510d2fca.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Learning-Against-All-Odds.md":"chunks/Learning-Against-All-Odds_c02aa2f5.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Obadiah.md":"chunks/Obadiah_e3e67c43.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Raymond.md":"chunks/Raymond_731e93cb.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/Surviving-in-Dzaleka.md":"chunks/Surviving-in-Dzaleka_96c60897.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/a-man-collecting-cardboard.md":"chunks/a-man-collecting-cardboard_419fb753.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/building-hope.md":"chunks/building-hope_210ad475.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/struggling-to-feed-a-community.md":"chunks/struggling-to-feed-a-community_7fe437a1.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/photos/tumaini-festival-2023.md":"chunks/tumaini-festival-2023_67b308b0.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/business-plan-template.md":"chunks/business-plan-template_092ca408.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/cv-writing-guide.md":"chunks/cv-writing-guide_3817fc21.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/digital-marketing-course.md":"chunks/digital-marketing-course_d736a1b1.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/glimpse-into-dzaleka-life.md":"chunks/glimpse-into-dzaleka-life_9acba07a.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/malawi-refugee-guide.md":"chunks/malawi-refugee-guide_29ebd674.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects.md":"chunks/refugee-entrepreneurship-in-malawi-success-factors-and-job-creation-effects_7ff7d0f7.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/research-report-refugee-relocation-intentions.md":"chunks/research-report-refugee-relocation-intentions_e7bfe9e6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/tumaini-impact-2019.md":"chunks/tumaini-impact-2019_4f825277.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/resources/tumaini-impact-2020.md":"chunks/tumaini-impact-2020_24036be6.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/adai-circle.md":"chunks/adai-circle_e380d1b2.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-art-project.md":"chunks/dzaleka-art-project_00695c64.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-blood-donors-services.md":"chunks/dzaleka-blood-donors-services_9611013a.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-community-radio.md":"chunks/dzaleka-community-radio_e43849a1.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-connect.md":"chunks/dzaleka-connect_28430da5.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-digital-heritage.md":"chunks/dzaleka-digital-heritage_3df5d9f3.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-rising.md":"chunks/dzaleka-rising_665e0f7f.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-watch.md":"chunks/dzaleka-watch_c55b6738.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/dzaleka-youth-organization.md":"chunks/dzaleka-youth-organization_01292f8b.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/fountain-of-hope-africa.md":"chunks/fountain-of-hope-africa_b3cc178b.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/fraternity-without-borders.md":"chunks/fraternity-without-borders_d456ae40.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/inside-dzaleka.md":"chunks/inside-dzaleka_443119f2.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/inua-advocacy.md":"chunks/inua-advocacy_64acf975.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/jesuit-worldwide-learning.md":"chunks/jesuit-worldwide-learning_6d164da0.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/jrs-malawi.md":"chunks/jrs-malawi_17ee67e1.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/kibebe.md":"chunks/kibebe_4e2f19f4.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/plan-international-malawi.md":"chunks/plan-international-malawi_cae96545.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/refugee-led-organisation-network-malawi.md":"chunks/refugee-led-organisation-network-malawi_aaa4c709.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/rock-your-world.md":"chunks/rock-your-world_adf289ae.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/salama-africa.md":"chunks/salama-africa_77e141b5.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/takenolab.md":"chunks/takenolab_ee8a98fb.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/there-is-hope-malawi.md":"chunks/there-is-hope-malawi_342e1029.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/tumaini-festival.md":"chunks/tumaini-festival_9c602c94.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/tumaini-letu.md":"chunks/tumaini-letu_3e0169e7.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/umoja-hand-craft-project.md":"chunks/umoja-hand-craft-project_556d5a44.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/unhcr-malawi.md":"chunks/unhcr-malawi_9b958bc4.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/vijanafrica.md":"chunks/vijanafrica_d2576fc1.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/village-book-builders.md":"chunks/village-book-builders_27bbb472.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/world-food-programme.md":"chunks/world-food-programme_15bd84e1.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/wusc-malawi.md":"chunks/wusc-malawi_52c4624a.mjs","/Users/bakari/Downloads/dzaleka heritage archive/src/content/services/zawadie-solutions.md":"chunks/zawadie-solutions_f1b0d856.mjs","/astro/hoisted.js?q=2":"_astro/hoisted.2f7d53e1.js","/astro/hoisted.js?q=0":"_astro/hoisted.9f90bd38.js","/astro/hoisted.js?q=4":"_astro/hoisted.c7b0b697.js","/astro/hoisted.js?q=5":"_astro/hoisted.2d585e0d.js","/astro/hoisted.js?q=3":"_astro/hoisted.235f185b.js","/astro/hoisted.js?q=1":"_astro/hoisted.291a29a9.js","/astro/hoisted.js?q=6":"_astro/hoisted.42cdea16.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/_slug_.7f397aac.css","/_astro/_slug_.826a85bb.css","/_astro/hoisted.235f185b.js","/_astro/hoisted.291a29a9.js","/_astro/hoisted.2d585e0d.js","/_astro/hoisted.2f7d53e1.js","/_astro/hoisted.42cdea16.js","/_astro/hoisted.9f90bd38.js","/_astro/hoisted.c7b0b697.js","/resources/pdf/FDeLeo_Refugee_Entrepreneurship_In_Malawi.pdf","/resources/pdf/MALAWI-REFUGEE-GUIDE-DEC-2024 (1).pdf","/resources/pdf/Tumaini-Letu-2019-Impact-Report.pdf","/resources/pdf/Tumaini-Letu-Impact-Report-2020-2.pdf","/resources/pdf/research-brief-february-2022-refugees-relocation-intentions-inua.pdf"]});

export { AstroCookies as A, Logger as L, RouteCache as R, computePreferredLocaleList as a, computeCurrentLocale as b, computePreferredLocale as c, dateTimeFormat as d, redirectRouteStatus as e, redirectRouteGenerate as f, routeIsFallback as g, attachCookiesToResponse as h, createAPIContext as i, callEndpoint as j, callMiddleware as k, levels as l, AstroIntegrationLogger as m, manifest, getSetCookiesFromResponse as n, createRenderContext as o, routeIsRedirect as r };
