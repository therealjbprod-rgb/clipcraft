var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, k as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, l as lookupResultToBuffer, m as RequestStatusResponseStatus, U as UnknownError, o as RequestStatusDoneNoReplyErrorCode, p as RejectError, q as CertifiedRejectErrorCode, t as UNREACHABLE_ERROR, I as InputError, v as InvalidReadStateRequestErrorCode, w as ReadRequestType, x as Principal, y as IDL, z as MissingCanisterIdErrorCode, H as HttpAgent, A as encode, Q as QueryResponseStatus, B as UncertifiedRejectErrorCode, D as isV3ResponseBody, F as isV2ResponseBody, G as UncertifiedRejectUpdateErrorCode, J as UnexpectedErrorCode, K as decode, S as Subscribable, L as pendingThenable, N as resolveEnabled, s as shallowEqualObjects, O as resolveStaleTime, b as noop, V as environmentManager, W as isValidTimeout, X as timeUntilStale, Y as timeoutManager, Z as focusManager, _ as fetchState, $ as replaceData, n as notifyManager, r as reactExports, c as shouldThrowError, a as useQueryClient, f as useInternetIdentity, a0 as createActorWithConfig, j as jsxRuntimeExports, d as React, a1 as reactDomExports, a2 as Variant, a3 as Record, a4 as Vec, a5 as Tuple, a6 as Opt, a7 as Service, a8 as Func, a9 as Nat, aa as Text, ab as Bool, ac as Null, ad as Float64, ae as Int, af as Principal$1 } from "./index-CVmM3hSM.js";
import { f as composeRefs, b as createLucideIcon, c as cn } from "./useTheme-DzgyOB_M.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler == null ? void 0 : originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler == null ? void 0 : ourEventHandler(event);
    }
  };
}
function createContext2(rootComponentName, defaultContext) {
  const Context = reactExports.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = reactExports.useMemo(() => context, Object.values(context));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
  };
  Provider.displayName = rootComponentName + "Provider";
  function useContext2(consumerName) {
    const context = reactExports.useContext(Context);
    if (context) return context;
    if (defaultContext !== void 0) return defaultContext;
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }
  return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a2;
      const { scope, children, ...context } = props;
      const Context = ((_a2 = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a2[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a2;
      const Context = ((_a2 = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a2[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var useLayoutEffect2 = (globalThis == null ? void 0 : globalThis.document) ? reactExports.useLayoutEffect : () => {
};
var useInsertionEffect = React[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  },
  caller
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  {
    const isControlledRef = reactExports.useRef(prop !== void 0);
    reactExports.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = reactExports.useCallback(
    (nextValue) => {
      var _a2;
      if (isControlled) {
        const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          (_a2 = onChangeRef.current) == null ? void 0 : _a2.call(onChangeRef, value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const [value, setValue] = reactExports.useState(defaultProp);
  const prevValueRef = reactExports.useRef(value);
  const onChangeRef = reactExports.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  reactExports.useEffect(() => {
    var _a2;
    if (prevValueRef.current !== value) {
      (_a2 = onChangeRef.current) == null ? void 0 : _a2.call(onChangeRef, value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction(value) {
  return typeof value === "function";
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
  const Slottable2 = ({ children }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  };
  Slottable2.displayName = `${ownerName}.Slottable`;
  Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
  return Slottable2;
}
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a2, _b;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = /* @__PURE__ */ createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) reactDomExports.flushSync(() => target.dispatchEvent(event));
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]
];
const Moon = createLucideIcon("moon", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M12 2v2", key: "tus03m" }],
  ["path", { d: "M12 20v2", key: "1lh1kg" }],
  ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
  ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
  ["path", { d: "M2 12h2", key: "1t8f8n" }],
  ["path", { d: "M20 12h2", key: "1q8mjw" }],
  ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
  ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
];
const Sun = createLucideIcon("sun", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const ProjectId = Nat;
const TrackId = Nat;
const ClipType = Variant({
  "audio": Null,
  "video": Null,
  "text": Null,
  "image": Null
});
const ClipId = Nat;
const EffectType = Variant({
  "blur": Null,
  "shake": Null,
  "colorShift": Null
});
const EffectId = Nat;
const AnimatableProperty = Variant({
  "rotation": Null,
  "shake_intensity": Null,
  "effect_intensity": Null,
  "scale_x": Null,
  "scale_y": Null,
  "blur_radius": Null,
  "position_x": Null,
  "position_y": Null,
  "hue_shift": Null,
  "shake_speed": Null,
  "opacity": Null,
  "saturation": Null
});
const EasingType = Variant({
  "easeInOut": Null,
  "bounce": Null,
  "easeIn": Null,
  "easeOut": Null,
  "linear": Null
});
const KeyframeId = Nat;
const Time = Int;
const ProjectMeta = Record({
  "id": ProjectId,
  "owner": Principal$1,
  "name": Text,
  "createdAt": Time,
  "totalDuration": Float64,
  "lastModified": Time
});
const PresetId = Nat;
const Keyframe = Record({
  "id": KeyframeId,
  "value": Float64,
  "time": Float64,
  "easing": EasingType
});
const KeyframeTrack = Record({
  "keyframes": Vec(Keyframe),
  "propertyName": AnimatableProperty
});
const MusicTrack = Record({
  "muted": Bool,
  "volume": Float64,
  "fileRef": Text
});
const Effect = Record({
  "id": EffectId,
  "keyframeTracks": Vec(KeyframeTrack),
  "effectType": EffectType,
  "params": Vec(Tuple(Text, Float64))
});
const ColorFilter = Record({
  "contrast": Float64,
  "hueRotation": Float64,
  "brightness": Float64,
  "opacity": Float64,
  "saturation": Float64
});
const TransitionType = Variant({
  "zoom": Null,
  "fadeToBlack": Null,
  "slide": Null,
  "crossfade": Null,
  "dissolve": Null
});
const Transition = Record({
  "duration": Float64,
  "transitionType": TransitionType
});
const TextClipProps = Record({
  "italic": Bool,
  "content": Text,
  "bold": Bool,
  "fontFamily": Text,
  "fontSize": Float64,
  "alignment": Variant({
    "center": Null,
    "left": Null,
    "right": Null
  }),
  "fontColor": Text
});
const Clip = Record({
  "id": ClipId,
  "duration": Float64,
  "keyframeTracks": Vec(KeyframeTrack),
  "trimOut": Float64,
  "effects": Vec(Effect),
  "colorFilter": ColorFilter,
  "trimIn": Float64,
  "transition": Opt(Transition),
  "clipType": ClipType,
  "volume": Float64,
  "textProps": Opt(TextClipProps),
  "speed": Float64,
  "trackId": TrackId,
  "position": Nat,
  "fileRef": Text
});
const Project = Record({
  "musicTrack": Opt(MusicTrack),
  "meta": ProjectMeta,
  "clips": Vec(Clip)
});
const Theme = Variant({ "dark": Null, "light": Null });
const UserPreferences = Record({ "theme": Theme });
const EffectPreset = Record({
  "id": PresetId,
  "name": Text,
  "creatorId": Principal$1,
  "effectType": EffectType,
  "isPublic": Bool,
  "params": Vec(Tuple(Text, Float64))
});
const TransitionType__1 = Variant({
  "blur": Null,
  "spin": Null,
  "zoom": Null,
  "fadeToBlack": Null,
  "slide": Null,
  "crossfade": Null,
  "glitch": Null,
  "dissolve": Null
});
const TransitionPreset = Record({
  "id": PresetId,
  "name": Text,
  "creatorId": Principal$1,
  "transitionType": TransitionType__1,
  "isPublic": Bool,
  "params": Vec(Tuple(Text, Float64))
});
const TimelineSnapshot = Record({
  "musicTrack": Opt(MusicTrack),
  "clips": Vec(Clip)
});
Service({
  "addClip": Func(
    [ProjectId, TrackId, Text, ClipType, Float64],
    [ClipId],
    []
  ),
  "addEffect": Func(
    [
      ProjectId,
      ClipId,
      EffectType,
      Vec(Tuple(Text, Float64))
    ],
    [EffectId],
    []
  ),
  "addKeyframe": Func(
    [
      ProjectId,
      ClipId,
      AnimatableProperty,
      Float64,
      Float64,
      EasingType
    ],
    [KeyframeId],
    []
  ),
  "createProject": Func([Text], [ProjectMeta], []),
  "deletePreset": Func([PresetId, Bool], [], []),
  "deleteProject": Func([ProjectId], [], []),
  "getClipKeyframeTracks": Func(
    [ProjectId, ClipId],
    [Vec(KeyframeTrack)],
    ["query"]
  ),
  "getProject": Func([ProjectId], [Opt(Project)], ["query"]),
  "getUserPreferences": Func([], [UserPreferences], ["query"]),
  "listEffectPresets": Func([], [Vec(EffectPreset)], ["query"]),
  "listProjects": Func([], [Vec(ProjectMeta)], ["query"]),
  "listTransitionPresets": Func(
    [],
    [Vec(TransitionPreset)],
    ["query"]
  ),
  "redo": Func([ProjectId], [Opt(TimelineSnapshot)], []),
  "removeClip": Func([ProjectId, ClipId], [], []),
  "removeEffect": Func([ProjectId, ClipId, EffectId], [], []),
  "removeKeyframe": Func(
    [ProjectId, ClipId, AnimatableProperty, KeyframeId],
    [],
    []
  ),
  "removeMusicTrack": Func([ProjectId], [], []),
  "renameProject": Func([ProjectId, Text], [], []),
  "reorderClip": Func([ProjectId, ClipId, Nat], [], []),
  "saveEffectPreset": Func(
    [
      Text,
      EffectType,
      Vec(Tuple(Text, Float64)),
      Bool
    ],
    [PresetId],
    []
  ),
  "saveProject": Func([ProjectId], [ProjectMeta], []),
  "saveTransitionPreset": Func(
    [
      Text,
      TransitionType__1,
      Vec(Tuple(Text, Float64)),
      Bool
    ],
    [PresetId],
    []
  ),
  "setMusicTrack": Func([ProjectId, Text, Float64], [], []),
  "setUserPreferences": Func([UserPreferences], [], []),
  "undo": Func([ProjectId], [Opt(TimelineSnapshot)], []),
  "updateClip": Func(
    [
      ProjectId,
      ClipId,
      Opt(Text),
      Opt(Float64),
      Opt(Float64),
      Opt(Float64),
      Opt(Float64),
      Opt(ColorFilter),
      Opt(Opt(Transition))
    ],
    [],
    []
  ),
  "updateEffect": Func(
    [ProjectId, ClipId, EffectId, Vec(Tuple(Text, Float64))],
    [],
    []
  ),
  "updateKeyframe": Func(
    [
      ProjectId,
      ClipId,
      AnimatableProperty,
      KeyframeId,
      Opt(Float64),
      Opt(EasingType)
    ],
    [],
    []
  ),
  "updateMusicTrack": Func(
    [ProjectId, Opt(Float64), Opt(Bool)],
    [],
    []
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const ProjectId2 = IDL2.Nat;
  const TrackId2 = IDL2.Nat;
  const ClipType2 = IDL2.Variant({
    "audio": IDL2.Null,
    "video": IDL2.Null,
    "text": IDL2.Null,
    "image": IDL2.Null
  });
  const ClipId2 = IDL2.Nat;
  const EffectType2 = IDL2.Variant({
    "blur": IDL2.Null,
    "shake": IDL2.Null,
    "colorShift": IDL2.Null
  });
  const EffectId2 = IDL2.Nat;
  const AnimatableProperty2 = IDL2.Variant({
    "rotation": IDL2.Null,
    "shake_intensity": IDL2.Null,
    "effect_intensity": IDL2.Null,
    "scale_x": IDL2.Null,
    "scale_y": IDL2.Null,
    "blur_radius": IDL2.Null,
    "position_x": IDL2.Null,
    "position_y": IDL2.Null,
    "hue_shift": IDL2.Null,
    "shake_speed": IDL2.Null,
    "opacity": IDL2.Null,
    "saturation": IDL2.Null
  });
  const EasingType2 = IDL2.Variant({
    "easeInOut": IDL2.Null,
    "bounce": IDL2.Null,
    "easeIn": IDL2.Null,
    "easeOut": IDL2.Null,
    "linear": IDL2.Null
  });
  const KeyframeId2 = IDL2.Nat;
  const Time2 = IDL2.Int;
  const ProjectMeta2 = IDL2.Record({
    "id": ProjectId2,
    "owner": IDL2.Principal,
    "name": IDL2.Text,
    "createdAt": Time2,
    "totalDuration": IDL2.Float64,
    "lastModified": Time2
  });
  const PresetId2 = IDL2.Nat;
  const Keyframe2 = IDL2.Record({
    "id": KeyframeId2,
    "value": IDL2.Float64,
    "time": IDL2.Float64,
    "easing": EasingType2
  });
  const KeyframeTrack2 = IDL2.Record({
    "keyframes": IDL2.Vec(Keyframe2),
    "propertyName": AnimatableProperty2
  });
  const MusicTrack2 = IDL2.Record({
    "muted": IDL2.Bool,
    "volume": IDL2.Float64,
    "fileRef": IDL2.Text
  });
  const Effect2 = IDL2.Record({
    "id": EffectId2,
    "keyframeTracks": IDL2.Vec(KeyframeTrack2),
    "effectType": EffectType2,
    "params": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Float64))
  });
  const ColorFilter2 = IDL2.Record({
    "contrast": IDL2.Float64,
    "hueRotation": IDL2.Float64,
    "brightness": IDL2.Float64,
    "opacity": IDL2.Float64,
    "saturation": IDL2.Float64
  });
  const TransitionType2 = IDL2.Variant({
    "zoom": IDL2.Null,
    "fadeToBlack": IDL2.Null,
    "slide": IDL2.Null,
    "crossfade": IDL2.Null,
    "dissolve": IDL2.Null
  });
  const Transition2 = IDL2.Record({
    "duration": IDL2.Float64,
    "transitionType": TransitionType2
  });
  const TextClipProps2 = IDL2.Record({
    "italic": IDL2.Bool,
    "content": IDL2.Text,
    "bold": IDL2.Bool,
    "fontFamily": IDL2.Text,
    "fontSize": IDL2.Float64,
    "alignment": IDL2.Variant({
      "center": IDL2.Null,
      "left": IDL2.Null,
      "right": IDL2.Null
    }),
    "fontColor": IDL2.Text
  });
  const Clip2 = IDL2.Record({
    "id": ClipId2,
    "duration": IDL2.Float64,
    "keyframeTracks": IDL2.Vec(KeyframeTrack2),
    "trimOut": IDL2.Float64,
    "effects": IDL2.Vec(Effect2),
    "colorFilter": ColorFilter2,
    "trimIn": IDL2.Float64,
    "transition": IDL2.Opt(Transition2),
    "clipType": ClipType2,
    "volume": IDL2.Float64,
    "textProps": IDL2.Opt(TextClipProps2),
    "speed": IDL2.Float64,
    "trackId": TrackId2,
    "position": IDL2.Nat,
    "fileRef": IDL2.Text
  });
  const Project2 = IDL2.Record({
    "musicTrack": IDL2.Opt(MusicTrack2),
    "meta": ProjectMeta2,
    "clips": IDL2.Vec(Clip2)
  });
  const Theme2 = IDL2.Variant({ "dark": IDL2.Null, "light": IDL2.Null });
  const UserPreferences2 = IDL2.Record({ "theme": Theme2 });
  const EffectPreset2 = IDL2.Record({
    "id": PresetId2,
    "name": IDL2.Text,
    "creatorId": IDL2.Principal,
    "effectType": EffectType2,
    "isPublic": IDL2.Bool,
    "params": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Float64))
  });
  const TransitionType__12 = IDL2.Variant({
    "blur": IDL2.Null,
    "spin": IDL2.Null,
    "zoom": IDL2.Null,
    "fadeToBlack": IDL2.Null,
    "slide": IDL2.Null,
    "crossfade": IDL2.Null,
    "glitch": IDL2.Null,
    "dissolve": IDL2.Null
  });
  const TransitionPreset2 = IDL2.Record({
    "id": PresetId2,
    "name": IDL2.Text,
    "creatorId": IDL2.Principal,
    "transitionType": TransitionType__12,
    "isPublic": IDL2.Bool,
    "params": IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Float64))
  });
  const TimelineSnapshot2 = IDL2.Record({
    "musicTrack": IDL2.Opt(MusicTrack2),
    "clips": IDL2.Vec(Clip2)
  });
  return IDL2.Service({
    "addClip": IDL2.Func(
      [ProjectId2, TrackId2, IDL2.Text, ClipType2, IDL2.Float64],
      [ClipId2],
      []
    ),
    "addEffect": IDL2.Func(
      [
        ProjectId2,
        ClipId2,
        EffectType2,
        IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Float64))
      ],
      [EffectId2],
      []
    ),
    "addKeyframe": IDL2.Func(
      [
        ProjectId2,
        ClipId2,
        AnimatableProperty2,
        IDL2.Float64,
        IDL2.Float64,
        EasingType2
      ],
      [KeyframeId2],
      []
    ),
    "createProject": IDL2.Func([IDL2.Text], [ProjectMeta2], []),
    "deletePreset": IDL2.Func([PresetId2, IDL2.Bool], [], []),
    "deleteProject": IDL2.Func([ProjectId2], [], []),
    "getClipKeyframeTracks": IDL2.Func(
      [ProjectId2, ClipId2],
      [IDL2.Vec(KeyframeTrack2)],
      ["query"]
    ),
    "getProject": IDL2.Func([ProjectId2], [IDL2.Opt(Project2)], ["query"]),
    "getUserPreferences": IDL2.Func([], [UserPreferences2], ["query"]),
    "listEffectPresets": IDL2.Func([], [IDL2.Vec(EffectPreset2)], ["query"]),
    "listProjects": IDL2.Func([], [IDL2.Vec(ProjectMeta2)], ["query"]),
    "listTransitionPresets": IDL2.Func(
      [],
      [IDL2.Vec(TransitionPreset2)],
      ["query"]
    ),
    "redo": IDL2.Func([ProjectId2], [IDL2.Opt(TimelineSnapshot2)], []),
    "removeClip": IDL2.Func([ProjectId2, ClipId2], [], []),
    "removeEffect": IDL2.Func([ProjectId2, ClipId2, EffectId2], [], []),
    "removeKeyframe": IDL2.Func(
      [ProjectId2, ClipId2, AnimatableProperty2, KeyframeId2],
      [],
      []
    ),
    "removeMusicTrack": IDL2.Func([ProjectId2], [], []),
    "renameProject": IDL2.Func([ProjectId2, IDL2.Text], [], []),
    "reorderClip": IDL2.Func([ProjectId2, ClipId2, IDL2.Nat], [], []),
    "saveEffectPreset": IDL2.Func(
      [
        IDL2.Text,
        EffectType2,
        IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Float64)),
        IDL2.Bool
      ],
      [PresetId2],
      []
    ),
    "saveProject": IDL2.Func([ProjectId2], [ProjectMeta2], []),
    "saveTransitionPreset": IDL2.Func(
      [
        IDL2.Text,
        TransitionType__12,
        IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Float64)),
        IDL2.Bool
      ],
      [PresetId2],
      []
    ),
    "setMusicTrack": IDL2.Func([ProjectId2, IDL2.Text, IDL2.Float64], [], []),
    "setUserPreferences": IDL2.Func([UserPreferences2], [], []),
    "undo": IDL2.Func([ProjectId2], [IDL2.Opt(TimelineSnapshot2)], []),
    "updateClip": IDL2.Func(
      [
        ProjectId2,
        ClipId2,
        IDL2.Opt(IDL2.Text),
        IDL2.Opt(IDL2.Float64),
        IDL2.Opt(IDL2.Float64),
        IDL2.Opt(IDL2.Float64),
        IDL2.Opt(IDL2.Float64),
        IDL2.Opt(ColorFilter2),
        IDL2.Opt(IDL2.Opt(Transition2))
      ],
      [],
      []
    ),
    "updateEffect": IDL2.Func(
      [
        ProjectId2,
        ClipId2,
        EffectId2,
        IDL2.Vec(IDL2.Tuple(IDL2.Text, IDL2.Float64))
      ],
      [],
      []
    ),
    "updateKeyframe": IDL2.Func(
      [
        ProjectId2,
        ClipId2,
        AnimatableProperty2,
        KeyframeId2,
        IDL2.Opt(IDL2.Float64),
        IDL2.Opt(EasingType2)
      ],
      [],
      []
    ),
    "updateMusicTrack": IDL2.Func(
      [ProjectId2, IDL2.Opt(IDL2.Float64), IDL2.Opt(IDL2.Bool)],
      [],
      []
    )
  });
};
function isNone(option) {
  return option.__kind__ === "None";
}
function unwrap(option) {
  if (isNone(option)) {
    throw new Error("unwrap: none");
  }
  return option.value;
}
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
function record_opt_to_undefined(arg) {
  return arg == null ? void 0 : arg;
}
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addClip(arg0, arg1, arg2, arg3, arg4) {
    if (this.processError) {
      try {
        const result = await this.actor.addClip(arg0, arg1, arg2, to_candid_ClipType_n1(this._uploadFile, this._downloadFile, arg3), arg4);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addClip(arg0, arg1, arg2, to_candid_ClipType_n1(this._uploadFile, this._downloadFile, arg3), arg4);
      return result;
    }
  }
  async addEffect(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.addEffect(arg0, arg1, to_candid_EffectType_n3(this._uploadFile, this._downloadFile, arg2), arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addEffect(arg0, arg1, to_candid_EffectType_n3(this._uploadFile, this._downloadFile, arg2), arg3);
      return result;
    }
  }
  async addKeyframe(arg0, arg1, arg2, arg3, arg4, arg5) {
    if (this.processError) {
      try {
        const result = await this.actor.addKeyframe(arg0, arg1, to_candid_AnimatableProperty_n5(this._uploadFile, this._downloadFile, arg2), arg3, arg4, to_candid_EasingType_n7(this._uploadFile, this._downloadFile, arg5));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addKeyframe(arg0, arg1, to_candid_AnimatableProperty_n5(this._uploadFile, this._downloadFile, arg2), arg3, arg4, to_candid_EasingType_n7(this._uploadFile, this._downloadFile, arg5));
      return result;
    }
  }
  async createProject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createProject(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createProject(arg0);
      return result;
    }
  }
  async deletePreset(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.deletePreset(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deletePreset(arg0, arg1);
      return result;
    }
  }
  async deleteProject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteProject(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteProject(arg0);
      return result;
    }
  }
  async getClipKeyframeTracks(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.getClipKeyframeTracks(arg0, arg1);
        return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getClipKeyframeTracks(arg0, arg1);
      return from_candid_vec_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async getProject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getProject(arg0);
        return from_candid_opt_n19(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getProject(arg0);
      return from_candid_opt_n19(this._uploadFile, this._downloadFile, result);
    }
  }
  async getUserPreferences() {
    if (this.processError) {
      try {
        const result = await this.actor.getUserPreferences();
        return from_candid_UserPreferences_n42(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getUserPreferences();
      return from_candid_UserPreferences_n42(this._uploadFile, this._downloadFile, result);
    }
  }
  async listEffectPresets() {
    if (this.processError) {
      try {
        const result = await this.actor.listEffectPresets();
        return from_candid_vec_n46(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listEffectPresets();
      return from_candid_vec_n46(this._uploadFile, this._downloadFile, result);
    }
  }
  async listProjects() {
    if (this.processError) {
      try {
        const result = await this.actor.listProjects();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listProjects();
      return result;
    }
  }
  async listTransitionPresets() {
    if (this.processError) {
      try {
        const result = await this.actor.listTransitionPresets();
        return from_candid_vec_n49(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listTransitionPresets();
      return from_candid_vec_n49(this._uploadFile, this._downloadFile, result);
    }
  }
  async redo(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.redo(arg0);
        return from_candid_opt_n54(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.redo(arg0);
      return from_candid_opt_n54(this._uploadFile, this._downloadFile, result);
    }
  }
  async removeClip(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.removeClip(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeClip(arg0, arg1);
      return result;
    }
  }
  async removeEffect(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.removeEffect(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeEffect(arg0, arg1, arg2);
      return result;
    }
  }
  async removeKeyframe(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.removeKeyframe(arg0, arg1, to_candid_AnimatableProperty_n5(this._uploadFile, this._downloadFile, arg2), arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeKeyframe(arg0, arg1, to_candid_AnimatableProperty_n5(this._uploadFile, this._downloadFile, arg2), arg3);
      return result;
    }
  }
  async removeMusicTrack(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.removeMusicTrack(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.removeMusicTrack(arg0);
      return result;
    }
  }
  async renameProject(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.renameProject(arg0, arg1);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.renameProject(arg0, arg1);
      return result;
    }
  }
  async reorderClip(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.reorderClip(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.reorderClip(arg0, arg1, arg2);
      return result;
    }
  }
  async saveEffectPreset(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.saveEffectPreset(arg0, to_candid_EffectType_n3(this._uploadFile, this._downloadFile, arg1), arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveEffectPreset(arg0, to_candid_EffectType_n3(this._uploadFile, this._downloadFile, arg1), arg2, arg3);
      return result;
    }
  }
  async saveProject(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.saveProject(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveProject(arg0);
      return result;
    }
  }
  async saveTransitionPreset(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.saveTransitionPreset(arg0, to_candid_TransitionType__1_n57(this._uploadFile, this._downloadFile, arg1), arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.saveTransitionPreset(arg0, to_candid_TransitionType__1_n57(this._uploadFile, this._downloadFile, arg1), arg2, arg3);
      return result;
    }
  }
  async setMusicTrack(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.setMusicTrack(arg0, arg1, arg2);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setMusicTrack(arg0, arg1, arg2);
      return result;
    }
  }
  async setUserPreferences(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.setUserPreferences(to_candid_UserPreferences_n59(this._uploadFile, this._downloadFile, arg0));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.setUserPreferences(to_candid_UserPreferences_n59(this._uploadFile, this._downloadFile, arg0));
      return result;
    }
  }
  async undo(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.undo(arg0);
        return from_candid_opt_n54(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.undo(arg0);
      return from_candid_opt_n54(this._uploadFile, this._downloadFile, result);
    }
  }
  async updateClip(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    if (this.processError) {
      try {
        const result = await this.actor.updateClip(arg0, arg1, to_candid_opt_n63(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n64(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n64(this._uploadFile, this._downloadFile, arg4), to_candid_opt_n64(this._uploadFile, this._downloadFile, arg5), to_candid_opt_n64(this._uploadFile, this._downloadFile, arg6), to_candid_opt_n65(this._uploadFile, this._downloadFile, arg7), to_candid_opt_n66(this._uploadFile, this._downloadFile, arg8));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateClip(arg0, arg1, to_candid_opt_n63(this._uploadFile, this._downloadFile, arg2), to_candid_opt_n64(this._uploadFile, this._downloadFile, arg3), to_candid_opt_n64(this._uploadFile, this._downloadFile, arg4), to_candid_opt_n64(this._uploadFile, this._downloadFile, arg5), to_candid_opt_n64(this._uploadFile, this._downloadFile, arg6), to_candid_opt_n65(this._uploadFile, this._downloadFile, arg7), to_candid_opt_n66(this._uploadFile, this._downloadFile, arg8));
      return result;
    }
  }
  async updateEffect(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.updateEffect(arg0, arg1, arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateEffect(arg0, arg1, arg2, arg3);
      return result;
    }
  }
  async updateKeyframe(arg0, arg1, arg2, arg3, arg4, arg5) {
    if (this.processError) {
      try {
        const result = await this.actor.updateKeyframe(arg0, arg1, to_candid_AnimatableProperty_n5(this._uploadFile, this._downloadFile, arg2), arg3, to_candid_opt_n64(this._uploadFile, this._downloadFile, arg4), to_candid_opt_n72(this._uploadFile, this._downloadFile, arg5));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateKeyframe(arg0, arg1, to_candid_AnimatableProperty_n5(this._uploadFile, this._downloadFile, arg2), arg3, to_candid_opt_n64(this._uploadFile, this._downloadFile, arg4), to_candid_opt_n72(this._uploadFile, this._downloadFile, arg5));
      return result;
    }
  }
  async updateMusicTrack(arg0, arg1, arg2) {
    if (this.processError) {
      try {
        const result = await this.actor.updateMusicTrack(arg0, to_candid_opt_n64(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n73(this._uploadFile, this._downloadFile, arg2));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateMusicTrack(arg0, to_candid_opt_n64(this._uploadFile, this._downloadFile, arg1), to_candid_opt_n73(this._uploadFile, this._downloadFile, arg2));
      return result;
    }
  }
}
function from_candid_AnimatableProperty_n17(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n18(_uploadFile, _downloadFile, value);
}
function from_candid_ClipType_n36(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n37(_uploadFile, _downloadFile, value);
}
function from_candid_Clip_n24(_uploadFile, _downloadFile, value) {
  return from_candid_record_n25(_uploadFile, _downloadFile, value);
}
function from_candid_EasingType_n15(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n16(_uploadFile, _downloadFile, value);
}
function from_candid_EffectPreset_n47(_uploadFile, _downloadFile, value) {
  return from_candid_record_n48(_uploadFile, _downloadFile, value);
}
function from_candid_EffectType_n29(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n30(_uploadFile, _downloadFile, value);
}
function from_candid_Effect_n27(_uploadFile, _downloadFile, value) {
  return from_candid_record_n28(_uploadFile, _downloadFile, value);
}
function from_candid_KeyframeTrack_n10(_uploadFile, _downloadFile, value) {
  return from_candid_record_n11(_uploadFile, _downloadFile, value);
}
function from_candid_Keyframe_n13(_uploadFile, _downloadFile, value) {
  return from_candid_record_n14(_uploadFile, _downloadFile, value);
}
function from_candid_Project_n20(_uploadFile, _downloadFile, value) {
  return from_candid_record_n21(_uploadFile, _downloadFile, value);
}
function from_candid_TextClipProps_n39(_uploadFile, _downloadFile, value) {
  return from_candid_record_n40(_uploadFile, _downloadFile, value);
}
function from_candid_Theme_n44(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n45(_uploadFile, _downloadFile, value);
}
function from_candid_TimelineSnapshot_n55(_uploadFile, _downloadFile, value) {
  return from_candid_record_n56(_uploadFile, _downloadFile, value);
}
function from_candid_TransitionPreset_n50(_uploadFile, _downloadFile, value) {
  return from_candid_record_n51(_uploadFile, _downloadFile, value);
}
function from_candid_TransitionType__1_n52(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n53(_uploadFile, _downloadFile, value);
}
function from_candid_TransitionType_n34(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n35(_uploadFile, _downloadFile, value);
}
function from_candid_Transition_n32(_uploadFile, _downloadFile, value) {
  return from_candid_record_n33(_uploadFile, _downloadFile, value);
}
function from_candid_UserPreferences_n42(_uploadFile, _downloadFile, value) {
  return from_candid_record_n43(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n19(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Project_n20(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n22(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_opt_n31(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_Transition_n32(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n38(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_TextClipProps_n39(_uploadFile, _downloadFile, value[0]);
}
function from_candid_opt_n54(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : from_candid_TimelineSnapshot_n55(_uploadFile, _downloadFile, value[0]);
}
function from_candid_record_n11(_uploadFile, _downloadFile, value) {
  return {
    keyframes: from_candid_vec_n12(_uploadFile, _downloadFile, value.keyframes),
    propertyName: from_candid_AnimatableProperty_n17(_uploadFile, _downloadFile, value.propertyName)
  };
}
function from_candid_record_n14(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    value: value.value,
    time: value.time,
    easing: from_candid_EasingType_n15(_uploadFile, _downloadFile, value.easing)
  };
}
function from_candid_record_n21(_uploadFile, _downloadFile, value) {
  return {
    musicTrack: record_opt_to_undefined(from_candid_opt_n22(_uploadFile, _downloadFile, value.musicTrack)),
    meta: value.meta,
    clips: from_candid_vec_n23(_uploadFile, _downloadFile, value.clips)
  };
}
function from_candid_record_n25(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    duration: value.duration,
    keyframeTracks: from_candid_vec_n9(_uploadFile, _downloadFile, value.keyframeTracks),
    trimOut: value.trimOut,
    effects: from_candid_vec_n26(_uploadFile, _downloadFile, value.effects),
    colorFilter: value.colorFilter,
    trimIn: value.trimIn,
    transition: record_opt_to_undefined(from_candid_opt_n31(_uploadFile, _downloadFile, value.transition)),
    clipType: from_candid_ClipType_n36(_uploadFile, _downloadFile, value.clipType),
    volume: value.volume,
    textProps: record_opt_to_undefined(from_candid_opt_n38(_uploadFile, _downloadFile, value.textProps)),
    speed: value.speed,
    trackId: value.trackId,
    position: value.position,
    fileRef: value.fileRef
  };
}
function from_candid_record_n28(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    keyframeTracks: from_candid_vec_n9(_uploadFile, _downloadFile, value.keyframeTracks),
    effectType: from_candid_EffectType_n29(_uploadFile, _downloadFile, value.effectType),
    params: value.params
  };
}
function from_candid_record_n33(_uploadFile, _downloadFile, value) {
  return {
    duration: value.duration,
    transitionType: from_candid_TransitionType_n34(_uploadFile, _downloadFile, value.transitionType)
  };
}
function from_candid_record_n40(_uploadFile, _downloadFile, value) {
  return {
    italic: value.italic,
    content: value.content,
    bold: value.bold,
    fontFamily: value.fontFamily,
    fontSize: value.fontSize,
    alignment: from_candid_variant_n41(_uploadFile, _downloadFile, value.alignment),
    fontColor: value.fontColor
  };
}
function from_candid_record_n43(_uploadFile, _downloadFile, value) {
  return {
    theme: from_candid_Theme_n44(_uploadFile, _downloadFile, value.theme)
  };
}
function from_candid_record_n48(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    name: value.name,
    creatorId: value.creatorId,
    effectType: from_candid_EffectType_n29(_uploadFile, _downloadFile, value.effectType),
    isPublic: value.isPublic,
    params: value.params
  };
}
function from_candid_record_n51(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    name: value.name,
    creatorId: value.creatorId,
    transitionType: from_candid_TransitionType__1_n52(_uploadFile, _downloadFile, value.transitionType),
    isPublic: value.isPublic,
    params: value.params
  };
}
function from_candid_record_n56(_uploadFile, _downloadFile, value) {
  return {
    musicTrack: record_opt_to_undefined(from_candid_opt_n22(_uploadFile, _downloadFile, value.musicTrack)),
    clips: from_candid_vec_n23(_uploadFile, _downloadFile, value.clips)
  };
}
function from_candid_variant_n16(_uploadFile, _downloadFile, value) {
  return "easeInOut" in value ? "easeInOut" : "bounce" in value ? "bounce" : "easeIn" in value ? "easeIn" : "easeOut" in value ? "easeOut" : "linear" in value ? "linear" : value;
}
function from_candid_variant_n18(_uploadFile, _downloadFile, value) {
  return "rotation" in value ? "rotation" : "shake_intensity" in value ? "shake_intensity" : "effect_intensity" in value ? "effect_intensity" : "scale_x" in value ? "scale_x" : "scale_y" in value ? "scale_y" : "blur_radius" in value ? "blur_radius" : "position_x" in value ? "position_x" : "position_y" in value ? "position_y" : "hue_shift" in value ? "hue_shift" : "shake_speed" in value ? "shake_speed" : "opacity" in value ? "opacity" : "saturation" in value ? "saturation" : value;
}
function from_candid_variant_n30(_uploadFile, _downloadFile, value) {
  return "blur" in value ? "blur" : "shake" in value ? "shake" : "colorShift" in value ? "colorShift" : value;
}
function from_candid_variant_n35(_uploadFile, _downloadFile, value) {
  return "zoom" in value ? "zoom" : "fadeToBlack" in value ? "fadeToBlack" : "slide" in value ? "slide" : "crossfade" in value ? "crossfade" : "dissolve" in value ? "dissolve" : value;
}
function from_candid_variant_n37(_uploadFile, _downloadFile, value) {
  return "audio" in value ? "audio" : "video" in value ? "video" : "text" in value ? "text" : "image" in value ? "image" : value;
}
function from_candid_variant_n41(_uploadFile, _downloadFile, value) {
  return "center" in value ? "center" : "left" in value ? "left" : "right" in value ? "right" : value;
}
function from_candid_variant_n45(_uploadFile, _downloadFile, value) {
  return "dark" in value ? "dark" : "light" in value ? "light" : value;
}
function from_candid_variant_n53(_uploadFile, _downloadFile, value) {
  return "blur" in value ? "blur" : "spin" in value ? "spin" : "zoom" in value ? "zoom" : "fadeToBlack" in value ? "fadeToBlack" : "slide" in value ? "slide" : "crossfade" in value ? "crossfade" : "glitch" in value ? "glitch" : "dissolve" in value ? "dissolve" : value;
}
function from_candid_vec_n12(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Keyframe_n13(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n23(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Clip_n24(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n26(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Effect_n27(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n46(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_EffectPreset_n47(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n49(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_TransitionPreset_n50(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n9(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_KeyframeTrack_n10(_uploadFile, _downloadFile, x));
}
function to_candid_AnimatableProperty_n5(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n6(_uploadFile, _downloadFile, value);
}
function to_candid_ClipType_n1(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n2(_uploadFile, _downloadFile, value);
}
function to_candid_EasingType_n7(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n8(_uploadFile, _downloadFile, value);
}
function to_candid_EffectType_n3(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function to_candid_Theme_n61(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n62(_uploadFile, _downloadFile, value);
}
function to_candid_TransitionType__1_n57(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n58(_uploadFile, _downloadFile, value);
}
function to_candid_TransitionType_n70(_uploadFile, _downloadFile, value) {
  return to_candid_variant_n71(_uploadFile, _downloadFile, value);
}
function to_candid_Transition_n68(_uploadFile, _downloadFile, value) {
  return to_candid_record_n69(_uploadFile, _downloadFile, value);
}
function to_candid_UserPreferences_n59(_uploadFile, _downloadFile, value) {
  return to_candid_record_n60(_uploadFile, _downloadFile, value);
}
function to_candid_opt_n63(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n64(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n65(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n66(_uploadFile, _downloadFile, value) {
  return isNone(value) ? candid_none() : candid_some(to_candid_opt_n67(_uploadFile, _downloadFile, unwrap(value)));
}
function to_candid_opt_n67(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid_Transition_n68(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n72(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(to_candid_EasingType_n7(_uploadFile, _downloadFile, value));
}
function to_candid_opt_n73(_uploadFile, _downloadFile, value) {
  return value === null ? candid_none() : candid_some(value);
}
function to_candid_record_n60(_uploadFile, _downloadFile, value) {
  return {
    theme: to_candid_Theme_n61(_uploadFile, _downloadFile, value.theme)
  };
}
function to_candid_record_n69(_uploadFile, _downloadFile, value) {
  return {
    duration: value.duration,
    transitionType: to_candid_TransitionType_n70(_uploadFile, _downloadFile, value.transitionType)
  };
}
function to_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return value == "audio" ? {
    audio: null
  } : value == "video" ? {
    video: null
  } : value == "text" ? {
    text: null
  } : value == "image" ? {
    image: null
  } : value;
}
function to_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return value == "blur" ? {
    blur: null
  } : value == "shake" ? {
    shake: null
  } : value == "colorShift" ? {
    colorShift: null
  } : value;
}
function to_candid_variant_n58(_uploadFile, _downloadFile, value) {
  return value == "blur" ? {
    blur: null
  } : value == "spin" ? {
    spin: null
  } : value == "zoom" ? {
    zoom: null
  } : value == "fadeToBlack" ? {
    fadeToBlack: null
  } : value == "slide" ? {
    slide: null
  } : value == "crossfade" ? {
    crossfade: null
  } : value == "glitch" ? {
    glitch: null
  } : value == "dissolve" ? {
    dissolve: null
  } : value;
}
function to_candid_variant_n6(_uploadFile, _downloadFile, value) {
  return value == "rotation" ? {
    rotation: null
  } : value == "shake_intensity" ? {
    shake_intensity: null
  } : value == "effect_intensity" ? {
    effect_intensity: null
  } : value == "scale_x" ? {
    scale_x: null
  } : value == "scale_y" ? {
    scale_y: null
  } : value == "blur_radius" ? {
    blur_radius: null
  } : value == "position_x" ? {
    position_x: null
  } : value == "position_y" ? {
    position_y: null
  } : value == "hue_shift" ? {
    hue_shift: null
  } : value == "shake_speed" ? {
    shake_speed: null
  } : value == "opacity" ? {
    opacity: null
  } : value == "saturation" ? {
    saturation: null
  } : value;
}
function to_candid_variant_n62(_uploadFile, _downloadFile, value) {
  return value == "dark" ? {
    dark: null
  } : value == "light" ? {
    light: null
  } : value;
}
function to_candid_variant_n71(_uploadFile, _downloadFile, value) {
  return value == "zoom" ? {
    zoom: null
  } : value == "fadeToBlack" ? {
    fadeToBlack: null
  } : value == "slide" ? {
    slide: null
  } : value == "crossfade" ? {
    crossfade: null
  } : value == "dissolve" ? {
    dissolve: null
  } : value;
}
function to_candid_variant_n8(_uploadFile, _downloadFile, value) {
  return value == "easeInOut" ? {
    easeInOut: null
  } : value == "bounce" ? {
    bounce: null
  } : value == "easeIn" ? {
    easeIn: null
  } : value == "easeOut" ? {
    easeOut: null
  } : value == "linear" ? {
    linear: null
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
export {
  Moon as M,
  Primitive as P,
  Sun as S,
  Trash2 as T,
  createSlot as a,
  useControllableState as b,
  createContextScope as c,
  composeEventHandlers as d,
  Plus as e,
  Skeleton as f,
  useActor as g,
  createActor as h,
  dispatchDiscreteCustomEvent as i,
  createContext2 as j,
  createSlottable as k,
  useQuery as l,
  useLayoutEffect2 as u
};
