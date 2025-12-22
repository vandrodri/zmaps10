"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/@huggingface/inference/dist/commonjs/config.js
var require_config = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/config.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HF_HEADER_X_BILL_TO = exports2.HF_ROUTER_AUTO_ENDPOINT = exports2.HF_ROUTER_URL = exports2.HF_HUB_URL = void 0;
    exports2.HF_HUB_URL = "https://huggingface.co";
    exports2.HF_ROUTER_URL = "https://router.huggingface.co";
    exports2.HF_ROUTER_AUTO_ENDPOINT = `${exports2.HF_ROUTER_URL}/v1`;
    exports2.HF_HEADER_X_BILL_TO = "X-HF-Bill-To";
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/consts.js
var require_consts = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/consts.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HARDCODED_MODEL_INFERENCE_MAPPING = void 0;
    exports2.HARDCODED_MODEL_INFERENCE_MAPPING = {
      /**
       * "HF model ID" => "Model ID on Inference Provider's side"
       *
       * Example:
       * "Qwen/Qwen2.5-Coder-32B-Instruct": "Qwen2.5-Coder-32B-Instruct",
       */
      baseten: {},
      "black-forest-labs": {},
      cerebras: {},
      clarifai: {},
      cohere: {},
      "fal-ai": {},
      "featherless-ai": {},
      "fireworks-ai": {},
      groq: {},
      "hf-inference": {},
      hyperbolic: {},
      nebius: {},
      novita: {},
      nscale: {},
      openai: {},
      publicai: {},
      ovhcloud: {},
      replicate: {},
      sambanova: {},
      scaleway: {},
      together: {},
      wavespeed: {},
      "zai-org": {}
    };
  }
});

// node_modules/@huggingface/inference/dist/commonjs/errors.js
var require_errors = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InferenceClientProviderOutputError = exports2.InferenceClientHubApiError = exports2.InferenceClientProviderApiError = exports2.InferenceClientRoutingError = exports2.InferenceClientInputError = exports2.InferenceClientError = void 0;
    var InferenceClientError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "InferenceClientError";
      }
    };
    exports2.InferenceClientError = InferenceClientError;
    var InferenceClientInputError = class extends InferenceClientError {
      constructor(message) {
        super(message);
        this.name = "InputError";
      }
    };
    exports2.InferenceClientInputError = InferenceClientInputError;
    var InferenceClientRoutingError = class extends InferenceClientError {
      constructor(message) {
        super(message);
        this.name = "RoutingError";
      }
    };
    exports2.InferenceClientRoutingError = InferenceClientRoutingError;
    var InferenceClientHttpRequestError = class extends InferenceClientError {
      httpRequest;
      httpResponse;
      constructor(message, httpRequest, httpResponse) {
        super(message);
        this.httpRequest = {
          ...httpRequest,
          ...httpRequest.headers ? {
            headers: {
              ...httpRequest.headers,
              ..."Authorization" in httpRequest.headers ? { Authorization: `Bearer [redacted]` } : void 0
              /// redact authentication in the request headers
            }
          } : void 0
        };
        this.httpResponse = httpResponse;
      }
    };
    var InferenceClientProviderApiError = class extends InferenceClientHttpRequestError {
      constructor(message, httpRequest, httpResponse) {
        super(message, httpRequest, httpResponse);
        this.name = "ProviderApiError";
      }
    };
    exports2.InferenceClientProviderApiError = InferenceClientProviderApiError;
    var InferenceClientHubApiError = class extends InferenceClientHttpRequestError {
      constructor(message, httpRequest, httpResponse) {
        super(message, httpRequest, httpResponse);
        this.name = "HubApiError";
      }
    };
    exports2.InferenceClientHubApiError = InferenceClientHubApiError;
    var InferenceClientProviderOutputError = class extends InferenceClientError {
      constructor(message) {
        super(message);
        this.name = "ProviderOutputError";
      }
    };
    exports2.InferenceClientProviderOutputError = InferenceClientProviderOutputError;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/utils/toArray.js
var require_toArray = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/utils/toArray.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toArray = toArray;
    function toArray(obj) {
      if (Array.isArray(obj)) {
        return obj;
      }
      return [obj];
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/providerHelper.js
var require_providerHelper = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/providerHelper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AutoRouterConversationalTask = exports2.BaseTextGenerationTask = exports2.BaseConversationalTask = exports2.TaskProviderHelper = void 0;
    var config_js_1 = require_config();
    var errors_js_1 = require_errors();
    var toArray_js_1 = require_toArray();
    var TaskProviderHelper = class {
      provider;
      baseUrl;
      clientSideRoutingOnly;
      constructor(provider, baseUrl, clientSideRoutingOnly = false) {
        this.provider = provider;
        this.baseUrl = baseUrl;
        this.clientSideRoutingOnly = clientSideRoutingOnly;
      }
      /**
       * Prepare the base URL for the request
       */
      makeBaseUrl(params) {
        return params.authMethod !== "provider-key" ? `${config_js_1.HF_ROUTER_URL}/${this.provider}` : this.baseUrl;
      }
      /**
       * Prepare the body for the request
       */
      makeBody(params) {
        if ("data" in params.args && !!params.args.data) {
          return params.args.data;
        }
        return JSON.stringify(this.preparePayload(params));
      }
      /**
       * Prepare the URL for the request
       */
      makeUrl(params) {
        const baseUrl = this.makeBaseUrl(params);
        const route = this.makeRoute(params).replace(/^\/+/, "");
        return `${baseUrl}/${route}`;
      }
      /**
       * Prepare the headers for the request
       */
      prepareHeaders(params, isBinary) {
        const headers = {};
        if (params.authMethod !== "none") {
          headers["Authorization"] = `Bearer ${params.accessToken}`;
        }
        if (!isBinary) {
          headers["Content-Type"] = "application/json";
        }
        return headers;
      }
    };
    exports2.TaskProviderHelper = TaskProviderHelper;
    var BaseConversationalTask = class extends TaskProviderHelper {
      constructor(provider, baseUrl, clientSideRoutingOnly = false) {
        super(provider, baseUrl, clientSideRoutingOnly);
      }
      makeRoute() {
        return "v1/chat/completions";
      }
      preparePayload(params) {
        return {
          ...params.args,
          model: params.model
        };
      }
      async getResponse(response) {
        if (typeof response === "object" && Array.isArray(response?.choices) && typeof response?.created === "number" && typeof response?.id === "string" && typeof response?.model === "string" && /// Together.ai and Nebius do not output a system_fingerprint
        (response.system_fingerprint === void 0 || response.system_fingerprint === null || typeof response.system_fingerprint === "string") && typeof response?.usage === "object") {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Expected ChatCompletionOutput");
      }
    };
    exports2.BaseConversationalTask = BaseConversationalTask;
    var BaseTextGenerationTask = class extends TaskProviderHelper {
      constructor(provider, baseUrl, clientSideRoutingOnly = false) {
        super(provider, baseUrl, clientSideRoutingOnly);
      }
      preparePayload(params) {
        return {
          ...params.args,
          model: params.model
        };
      }
      makeRoute() {
        return "v1/completions";
      }
      async getResponse(response) {
        const res = (0, toArray_js_1.toArray)(response);
        if (Array.isArray(res) && res.length > 0 && res.every((x) => typeof x === "object" && !!x && "generated_text" in x && typeof x.generated_text === "string")) {
          return res[0];
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Expected Array<{generated_text: string}>");
      }
    };
    exports2.BaseTextGenerationTask = BaseTextGenerationTask;
    var AutoRouterConversationalTask = class extends BaseConversationalTask {
      constructor() {
        super("auto", "https://router.huggingface.co");
      }
      makeBaseUrl(params) {
        if (params.authMethod !== "hf-token") {
          throw new errors_js_1.InferenceClientRoutingError("Cannot select auto-router when using non-Hugging Face API key.");
        }
        return this.baseUrl;
      }
    };
    exports2.AutoRouterConversationalTask = AutoRouterConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/utils/base64FromBytes.js
var require_base64FromBytes = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/utils/base64FromBytes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.base64FromBytes = base64FromBytes;
    function base64FromBytes(arr) {
      if (globalThis.Buffer) {
        return globalThis.Buffer.from(arr).toString("base64");
      } else {
        const bin = [];
        arr.forEach((byte) => {
          bin.push(String.fromCharCode(byte));
        });
        return globalThis.btoa(bin.join(""));
      }
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/utils/pick.js
var require_pick = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/utils/pick.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.pick = pick;
    function pick(o, props) {
      return Object.assign({}, ...props.map((prop) => {
        if (o[prop] !== void 0) {
          return { [prop]: o[prop] };
        }
      }));
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/utils/typedInclude.js
var require_typedInclude = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/utils/typedInclude.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.typedInclude = typedInclude;
    function typedInclude(arr, v) {
      return arr.includes(v);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/utils/omit.js
var require_omit = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/utils/omit.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.omit = omit;
    var pick_js_1 = require_pick();
    var typedInclude_js_1 = require_typedInclude();
    function omit(o, props) {
      const propsArr = Array.isArray(props) ? props : [props];
      const letsKeep = Object.keys(o).filter((prop) => !(0, typedInclude_js_1.typedInclude)(propsArr, prop));
      return (0, pick_js_1.pick)(o, letsKeep);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/hf-inference.js
var require_hf_inference = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/hf-inference.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HFInferenceTextToAudioTask = exports2.HFInferenceTabularRegressionTask = exports2.HFInferenceVisualQuestionAnsweringTask = exports2.HFInferenceTabularClassificationTask = exports2.HFInferenceTextToSpeechTask = exports2.HFInferenceSummarizationTask = exports2.HFInferenceTranslationTask = exports2.HFInferenceTokenClassificationTask = exports2.HFInferenceTableQuestionAnsweringTask = exports2.HFInferenceSentenceSimilarityTask = exports2.HFInferenceZeroShotClassificationTask = exports2.HFInferenceFillMaskTask = exports2.HFInferenceQuestionAnsweringTask = exports2.HFInferenceTextClassificationTask = exports2.HFInferenceZeroShotImageClassificationTask = exports2.HFInferenceObjectDetectionTask = exports2.HFInferenceImageToImageTask = exports2.HFInferenceImageToTextTask = exports2.HFInferenceImageSegmentationTask = exports2.HFInferenceImageClassificationTask = exports2.HFInferenceFeatureExtractionTask = exports2.HFInferenceDocumentQuestionAnsweringTask = exports2.HFInferenceAudioToAudioTask = exports2.HFInferenceAutomaticSpeechRecognitionTask = exports2.HFInferenceAudioClassificationTask = exports2.HFInferenceTextGenerationTask = exports2.HFInferenceConversationalTask = exports2.HFInferenceTextToImageTask = exports2.HFInferenceTask = exports2.EQUIVALENT_SENTENCE_TRANSFORMERS_TASKS = void 0;
    var config_js_1 = require_config();
    var errors_js_1 = require_errors();
    var toArray_js_1 = require_toArray();
    var providerHelper_js_1 = require_providerHelper();
    var base64FromBytes_js_1 = require_base64FromBytes();
    var omit_js_1 = require_omit();
    exports2.EQUIVALENT_SENTENCE_TRANSFORMERS_TASKS = ["feature-extraction", "sentence-similarity"];
    var HFInferenceTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("hf-inference", `${config_js_1.HF_ROUTER_URL}/hf-inference`);
      }
      preparePayload(params) {
        return params.args;
      }
      makeUrl(params) {
        if (params.model.startsWith("http://") || params.model.startsWith("https://")) {
          return params.model;
        }
        return super.makeUrl(params);
      }
      makeRoute(params) {
        if (params.task && ["feature-extraction", "sentence-similarity"].includes(params.task)) {
          return `models/${params.model}/pipeline/${params.task}`;
        }
        return `models/${params.model}`;
      }
      async getResponse(response) {
        return response;
      }
    };
    exports2.HFInferenceTask = HFInferenceTask;
    var HFInferenceTextToImageTask = class extends HFInferenceTask {
      async getResponse(response, url, headers, outputType) {
        if (!response) {
          throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference text-to-image API: response is undefined");
        }
        if (typeof response == "object") {
          if (outputType === "json") {
            return { ...response };
          }
          if ("data" in response && Array.isArray(response.data) && response.data[0].b64_json) {
            const base64Data = response.data[0].b64_json;
            if (outputType === "url") {
              return `data:image/jpeg;base64,${base64Data}`;
            }
            const base64Response = await fetch(`data:image/jpeg;base64,${base64Data}`);
            return await base64Response.blob();
          }
          if ("output" in response && Array.isArray(response.output)) {
            if (outputType === "url") {
              return response.output[0];
            }
            const urlResponse = await fetch(response.output[0]);
            const blob = await urlResponse.blob();
            return blob;
          }
        }
        if (response instanceof Blob) {
          if (outputType === "url" || outputType === "json") {
            const b64 = await response.arrayBuffer().then((buf) => Buffer.from(buf).toString("base64"));
            return outputType === "url" ? `data:image/jpeg;base64,${b64}` : { output: `data:image/jpeg;base64,${b64}` };
          }
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference text-to-image API: expected a Blob");
      }
    };
    exports2.HFInferenceTextToImageTask = HFInferenceTextToImageTask;
    var HFInferenceConversationalTask = class extends HFInferenceTask {
      makeUrl(params) {
        let url;
        if (params.model.startsWith("http://") || params.model.startsWith("https://")) {
          url = params.model.trim();
        } else {
          url = `${this.makeBaseUrl(params)}/models/${params.model}`;
        }
        url = url.replace(/\/+$/, "");
        if (url.endsWith("/v1")) {
          url += "/chat/completions";
        } else if (!url.endsWith("/chat/completions")) {
          url += "/v1/chat/completions";
        }
        return url;
      }
      preparePayload(params) {
        return {
          ...params.args,
          model: params.model
        };
      }
      async getResponse(response) {
        return response;
      }
    };
    exports2.HFInferenceConversationalTask = HFInferenceConversationalTask;
    var HFInferenceTextGenerationTask = class extends HFInferenceTask {
      async getResponse(response) {
        const res = (0, toArray_js_1.toArray)(response);
        if (Array.isArray(res) && res.every((x) => "generated_text" in x && typeof x?.generated_text === "string")) {
          return res?.[0];
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference text generation API: expected Array<{generated_text: string}>");
      }
    };
    exports2.HFInferenceTextGenerationTask = HFInferenceTextGenerationTask;
    var HFInferenceAudioClassificationTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x === "object" && x !== null && typeof x.label === "string" && typeof x.score === "number")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference audio-classification API: expected Array<{label: string, score: number}> but received different format");
      }
    };
    exports2.HFInferenceAudioClassificationTask = HFInferenceAudioClassificationTask;
    var HFInferenceAutomaticSpeechRecognitionTask = class extends HFInferenceTask {
      async getResponse(response) {
        return response;
      }
      async preparePayloadAsync(args) {
        return "data" in args ? args : {
          ...(0, omit_js_1.omit)(args, "inputs"),
          data: args.inputs
        };
      }
    };
    exports2.HFInferenceAutomaticSpeechRecognitionTask = HFInferenceAutomaticSpeechRecognitionTask;
    var HFInferenceAudioToAudioTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (!Array.isArray(response)) {
          throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference audio-to-audio API: expected Array");
        }
        if (!response.every((elem) => {
          return typeof elem === "object" && elem && "label" in elem && typeof elem.label === "string" && "content-type" in elem && typeof elem["content-type"] === "string" && "blob" in elem && typeof elem.blob === "string";
        })) {
          throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference audio-to-audio API: expected Array<{label: string, audio: Blob}>");
        }
        return response;
      }
    };
    exports2.HFInferenceAudioToAudioTask = HFInferenceAudioToAudioTask;
    var HFInferenceDocumentQuestionAnsweringTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((elem) => typeof elem === "object" && !!elem && typeof elem?.answer === "string" && (typeof elem.end === "number" || typeof elem.end === "undefined") && (typeof elem.score === "number" || typeof elem.score === "undefined") && (typeof elem.start === "number" || typeof elem.start === "undefined"))) {
          return response[0];
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference document-question-answering API: expected Array<{answer: string, end: number, score: number, start: number}>");
      }
    };
    exports2.HFInferenceDocumentQuestionAnsweringTask = HFInferenceDocumentQuestionAnsweringTask;
    var HFInferenceFeatureExtractionTask = class extends HFInferenceTask {
      async getResponse(response) {
        const isNumArrayRec = (arr, maxDepth, curDepth = 0) => {
          if (curDepth > maxDepth)
            return false;
          if (arr.every((x) => Array.isArray(x))) {
            return arr.every((x) => isNumArrayRec(x, maxDepth, curDepth + 1));
          } else {
            return arr.every((x) => typeof x === "number");
          }
        };
        if (Array.isArray(response) && isNumArrayRec(response, 3, 0)) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference feature-extraction API: expected Array<number[][][] | number[][] | number[] | number>");
      }
    };
    exports2.HFInferenceFeatureExtractionTask = HFInferenceFeatureExtractionTask;
    var HFInferenceImageClassificationTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x.label === "string" && typeof x.score === "number")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference image-classification API: expected Array<{label: string, score: number}>");
      }
    };
    exports2.HFInferenceImageClassificationTask = HFInferenceImageClassificationTask;
    var HFInferenceImageSegmentationTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x.label === "string" && typeof x.mask === "string" && (x.score === void 0 || typeof x.score === "number"))) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference image-segmentation API: expected Array<{label: string, mask: string, score: number}>");
      }
      async preparePayloadAsync(args) {
        return {
          ...args,
          inputs: (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(args.inputs instanceof ArrayBuffer ? args.inputs : await args.inputs.arrayBuffer()))
        };
      }
    };
    exports2.HFInferenceImageSegmentationTask = HFInferenceImageSegmentationTask;
    var HFInferenceImageToTextTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (typeof response?.generated_text !== "string") {
          throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference image-to-text API: expected {generated_text: string}");
        }
        return response;
      }
    };
    exports2.HFInferenceImageToTextTask = HFInferenceImageToTextTask;
    var HFInferenceImageToImageTask = class extends HFInferenceTask {
      async preparePayloadAsync(args) {
        if (!args.parameters) {
          return {
            ...args,
            model: args.model,
            data: args.inputs
          };
        } else {
          return {
            ...args,
            inputs: (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(args.inputs instanceof ArrayBuffer ? args.inputs : await args.inputs.arrayBuffer()))
          };
        }
      }
      async getResponse(response) {
        if (response instanceof Blob) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference image-to-image API: expected Blob");
      }
    };
    exports2.HFInferenceImageToImageTask = HFInferenceImageToImageTask;
    var HFInferenceObjectDetectionTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x.label === "string" && typeof x.score === "number" && typeof x.box.xmin === "number" && typeof x.box.ymin === "number" && typeof x.box.xmax === "number" && typeof x.box.ymax === "number")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference object-detection API: expected Array<{label: string, score: number, box: {xmin: number, ymin: number, xmax: number, ymax: number}}>");
      }
    };
    exports2.HFInferenceObjectDetectionTask = HFInferenceObjectDetectionTask;
    var HFInferenceZeroShotImageClassificationTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x.label === "string" && typeof x.score === "number")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference zero-shot-image-classification API: expected Array<{label: string, score: number}>");
      }
    };
    exports2.HFInferenceZeroShotImageClassificationTask = HFInferenceZeroShotImageClassificationTask;
    var HFInferenceTextClassificationTask = class extends HFInferenceTask {
      async getResponse(response) {
        const output = response?.[0];
        if (Array.isArray(output) && output.every((x) => typeof x?.label === "string" && typeof x.score === "number")) {
          return output;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference text-classification API: expected Array<{label: string, score: number}>");
      }
    };
    exports2.HFInferenceTextClassificationTask = HFInferenceTextClassificationTask;
    var HFInferenceQuestionAnsweringTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) ? response.every((elem) => typeof elem === "object" && !!elem && typeof elem.answer === "string" && typeof elem.end === "number" && typeof elem.score === "number" && typeof elem.start === "number") : typeof response === "object" && !!response && typeof response.answer === "string" && typeof response.end === "number" && typeof response.score === "number" && typeof response.start === "number") {
          return Array.isArray(response) ? response[0] : response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference question-answering API: expected Array<{answer: string, end: number, score: number, start: number}>");
      }
    };
    exports2.HFInferenceQuestionAnsweringTask = HFInferenceQuestionAnsweringTask;
    var HFInferenceFillMaskTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x.score === "number" && typeof x.sequence === "string" && typeof x.token === "number" && typeof x.token_str === "string")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference fill-mask API: expected Array<{score: number, sequence: string, token: number, token_str: string}>");
      }
    };
    exports2.HFInferenceFillMaskTask = HFInferenceFillMaskTask;
    var HFInferenceZeroShotClassificationTask = class _HFInferenceZeroShotClassificationTask extends HFInferenceTask {
      async getResponse(response) {
        if (typeof response === "object" && response !== null && "labels" in response && "scores" in response && Array.isArray(response.labels) && Array.isArray(response.scores) && response.labels.length === response.scores.length && response.labels.every((label) => typeof label === "string") && response.scores.every((score) => typeof score === "number")) {
          const scores = response.scores;
          return response.labels.map((label, index) => ({
            label,
            score: scores[index]
          }));
        }
        if (Array.isArray(response) && response.every(_HFInferenceZeroShotClassificationTask.validateOutputElement)) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference zero-shot-classification API: expected Array<{label: string, score: number}>");
      }
      static validateOutputElement(elem) {
        return typeof elem === "object" && !!elem && "label" in elem && "score" in elem && typeof elem.label === "string" && typeof elem.score === "number";
      }
    };
    exports2.HFInferenceZeroShotClassificationTask = HFInferenceZeroShotClassificationTask;
    var HFInferenceSentenceSimilarityTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x === "number")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference sentence-similarity API: expected Array<number>");
      }
    };
    exports2.HFInferenceSentenceSimilarityTask = HFInferenceSentenceSimilarityTask;
    var HFInferenceTableQuestionAnsweringTask = class _HFInferenceTableQuestionAnsweringTask extends HFInferenceTask {
      static validate(elem) {
        return typeof elem === "object" && !!elem && "aggregator" in elem && typeof elem.aggregator === "string" && "answer" in elem && typeof elem.answer === "string" && "cells" in elem && Array.isArray(elem.cells) && elem.cells.every((x) => typeof x === "string") && "coordinates" in elem && Array.isArray(elem.coordinates) && elem.coordinates.every((coord) => Array.isArray(coord) && coord.every((x) => typeof x === "number"));
      }
      async getResponse(response) {
        if (Array.isArray(response) && Array.isArray(response) ? response.every((elem) => _HFInferenceTableQuestionAnsweringTask.validate(elem)) : _HFInferenceTableQuestionAnsweringTask.validate(response)) {
          return Array.isArray(response) ? response[0] : response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference table-question-answering API: expected {aggregator: string, answer: string, cells: string[], coordinates: number[][]}");
      }
    };
    exports2.HFInferenceTableQuestionAnsweringTask = HFInferenceTableQuestionAnsweringTask;
    var HFInferenceTokenClassificationTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x.end === "number" && typeof x.entity_group === "string" && typeof x.score === "number" && typeof x.start === "number" && typeof x.word === "string")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference token-classification API: expected Array<{end: number, entity_group: string, score: number, start: number, word: string}>");
      }
    };
    exports2.HFInferenceTokenClassificationTask = HFInferenceTokenClassificationTask;
    var HFInferenceTranslationTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x?.translation_text === "string")) {
          return response?.length === 1 ? response?.[0] : response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference translation API: expected Array<{translation_text: string}>");
      }
    };
    exports2.HFInferenceTranslationTask = HFInferenceTranslationTask;
    var HFInferenceSummarizationTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x?.summary_text === "string")) {
          return response?.[0];
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference summarization API: expected Array<{summary_text: string}>");
      }
    };
    exports2.HFInferenceSummarizationTask = HFInferenceSummarizationTask;
    var HFInferenceTextToSpeechTask = class extends HFInferenceTask {
      async getResponse(response) {
        return response;
      }
    };
    exports2.HFInferenceTextToSpeechTask = HFInferenceTextToSpeechTask;
    var HFInferenceTabularClassificationTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x === "number")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference tabular-classification API: expected Array<number>");
      }
    };
    exports2.HFInferenceTabularClassificationTask = HFInferenceTabularClassificationTask;
    var HFInferenceVisualQuestionAnsweringTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((elem) => typeof elem === "object" && !!elem && typeof elem?.answer === "string" && typeof elem.score === "number")) {
          return response[0];
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference visual-question-answering API: expected Array<{answer: string, score: number}>");
      }
    };
    exports2.HFInferenceVisualQuestionAnsweringTask = HFInferenceVisualQuestionAnsweringTask;
    var HFInferenceTabularRegressionTask = class extends HFInferenceTask {
      async getResponse(response) {
        if (Array.isArray(response) && response.every((x) => typeof x === "number")) {
          return response;
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from HF-Inference tabular-regression API: expected Array<number>");
      }
    };
    exports2.HFInferenceTabularRegressionTask = HFInferenceTabularRegressionTask;
    var HFInferenceTextToAudioTask = class extends HFInferenceTask {
      async getResponse(response) {
        return response;
      }
    };
    exports2.HFInferenceTextToAudioTask = HFInferenceTextToAudioTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/lib/logger.js
var require_logger = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/lib/logger.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.setLogger = setLogger;
    exports2.getLogger = getLogger;
    var globalLogger = console;
    function setLogger(logger) {
      globalLogger = logger;
    }
    function getLogger() {
      return globalLogger;
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/lib/getInferenceProviderMapping.js
var require_getInferenceProviderMapping = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/lib/getInferenceProviderMapping.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.inferenceProviderMappingCache = void 0;
    exports2.fetchInferenceProviderMappingForModel = fetchInferenceProviderMappingForModel;
    exports2.getInferenceProviderMapping = getInferenceProviderMapping;
    exports2.resolveProvider = resolveProvider;
    var config_js_1 = require_config();
    var consts_js_1 = require_consts();
    var hf_inference_js_1 = require_hf_inference();
    var typedInclude_js_1 = require_typedInclude();
    var errors_js_1 = require_errors();
    var logger_js_1 = require_logger();
    exports2.inferenceProviderMappingCache = /* @__PURE__ */ new Map();
    function normalizeInferenceProviderMapping(modelId, inferenceProviderMapping) {
      if (!inferenceProviderMapping) {
        return [];
      }
      if (Array.isArray(inferenceProviderMapping)) {
        return inferenceProviderMapping;
      }
      return Object.entries(inferenceProviderMapping).map(([provider, mapping]) => ({
        provider,
        hfModelId: modelId,
        providerId: mapping.providerId,
        status: mapping.status,
        task: mapping.task,
        adapter: mapping.adapter,
        adapterWeightsPath: mapping.adapterWeightsPath
      }));
    }
    async function fetchInferenceProviderMappingForModel(modelId, accessToken, options) {
      let inferenceProviderMapping;
      if (exports2.inferenceProviderMappingCache.has(modelId)) {
        inferenceProviderMapping = exports2.inferenceProviderMappingCache.get(modelId);
      } else {
        const url = `${config_js_1.HF_HUB_URL}/api/models/${modelId}?expand[]=inferenceProviderMapping`;
        const resp = await (options?.fetch ?? fetch)(url, {
          headers: accessToken?.startsWith("hf_") ? { Authorization: `Bearer ${accessToken}` } : {}
        });
        if (!resp.ok) {
          if (resp.headers.get("Content-Type")?.startsWith("application/json")) {
            const error = await resp.json();
            if ("error" in error && typeof error.error === "string") {
              throw new errors_js_1.InferenceClientHubApiError(`Failed to fetch inference provider mapping for model ${modelId}: ${error.error}`, { url, method: "GET" }, { requestId: resp.headers.get("x-request-id") ?? "", status: resp.status, body: error });
            }
          } else {
            throw new errors_js_1.InferenceClientHubApiError(`Failed to fetch inference provider mapping for model ${modelId}`, { url, method: "GET" }, { requestId: resp.headers.get("x-request-id") ?? "", status: resp.status, body: await resp.text() });
          }
        }
        let payload = null;
        try {
          payload = await resp.json();
        } catch {
          throw new errors_js_1.InferenceClientHubApiError(`Failed to fetch inference provider mapping for model ${modelId}: malformed API response, invalid JSON`, { url, method: "GET" }, { requestId: resp.headers.get("x-request-id") ?? "", status: resp.status, body: await resp.text() });
        }
        if (!payload?.inferenceProviderMapping) {
          throw new errors_js_1.InferenceClientHubApiError(`We have not been able to find inference provider information for model ${modelId}.`, { url, method: "GET" }, { requestId: resp.headers.get("x-request-id") ?? "", status: resp.status, body: await resp.text() });
        }
        inferenceProviderMapping = normalizeInferenceProviderMapping(modelId, payload.inferenceProviderMapping);
        exports2.inferenceProviderMappingCache.set(modelId, inferenceProviderMapping);
      }
      return inferenceProviderMapping;
    }
    async function getInferenceProviderMapping(params, options) {
      const logger = (0, logger_js_1.getLogger)();
      if (params.provider === "auto" && params.task === "conversational") {
        return {
          hfModelId: params.modelId,
          provider: "auto",
          providerId: params.modelId,
          status: "live",
          task: "conversational"
        };
      }
      if (consts_js_1.HARDCODED_MODEL_INFERENCE_MAPPING[params.provider][params.modelId]) {
        return consts_js_1.HARDCODED_MODEL_INFERENCE_MAPPING[params.provider][params.modelId];
      }
      const mappings = await fetchInferenceProviderMappingForModel(params.modelId, params.accessToken, options);
      const providerMapping = mappings.find((mapping) => mapping.provider === params.provider);
      if (providerMapping) {
        const equivalentTasks = params.provider === "hf-inference" && (0, typedInclude_js_1.typedInclude)(hf_inference_js_1.EQUIVALENT_SENTENCE_TRANSFORMERS_TASKS, params.task) ? hf_inference_js_1.EQUIVALENT_SENTENCE_TRANSFORMERS_TASKS : [params.task];
        if (!(0, typedInclude_js_1.typedInclude)(equivalentTasks, providerMapping.task)) {
          throw new errors_js_1.InferenceClientInputError(`Model ${params.modelId} is not supported for task ${params.task} and provider ${params.provider}. Supported task: ${providerMapping.task}.`);
        }
        if (providerMapping.status === "staging") {
          logger.warn(`Model ${params.modelId} is in staging mode for provider ${params.provider}. Meant for test purposes only.`);
        }
        return providerMapping;
      }
      return null;
    }
    async function resolveProvider(provider, modelId, endpointUrl) {
      const logger = (0, logger_js_1.getLogger)();
      if (endpointUrl) {
        if (provider) {
          throw new errors_js_1.InferenceClientInputError("Specifying both endpointUrl and provider is not supported.");
        }
        return "hf-inference";
      }
      if (!provider) {
        logger.log("Defaulting to 'auto' which will select the first provider available for the model, sorted by the user's order in https://hf.co/settings/inference-providers.");
        provider = "auto";
      }
      if (provider === "auto") {
        if (!modelId) {
          throw new errors_js_1.InferenceClientInputError("Specifying a model is required when provider is 'auto'");
        }
        const mappings = await fetchInferenceProviderMappingForModel(modelId);
        provider = mappings[0]?.provider;
        logger.log("Auto selected provider:", provider);
      }
      if (!provider) {
        throw new errors_js_1.InferenceClientInputError(`No Inference Provider available for model ${modelId}.`);
      }
      return provider;
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/baseten.js
var require_baseten = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/baseten.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.BasetenConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var BASETEN_API_BASE_URL = "https://inference.baseten.co";
    var BasetenConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("baseten", BASETEN_API_BASE_URL);
      }
    };
    exports2.BasetenConversationalTask = BasetenConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/clarifai.js
var require_clarifai = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/clarifai.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ClarifaiConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var CLARIFAI_API_BASE_URL = "https://api.clarifai.com";
    var ClarifaiConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("clarifai", CLARIFAI_API_BASE_URL);
      }
      makeRoute() {
        return "/v2/ext/openai/v1/chat/completions";
      }
      prepareHeaders(params, isBinary) {
        const headers = {
          Authorization: params.authMethod !== "provider-key" ? `Bearer ${params.accessToken}` : `Key ${params.accessToken}`
        };
        if (!isBinary) {
          headers["Content-Type"] = "application/json";
        }
        return headers;
      }
    };
    exports2.ClarifaiConversationalTask = ClarifaiConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/utils/delay.js
var require_delay = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/utils/delay.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.delay = delay;
    function delay(ms) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
      });
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/black-forest-labs.js
var require_black_forest_labs = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/black-forest-labs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.BlackForestLabsTextToImageTask = void 0;
    var errors_js_1 = require_errors();
    var logger_js_1 = require_logger();
    var delay_js_1 = require_delay();
    var omit_js_1 = require_omit();
    var providerHelper_js_1 = require_providerHelper();
    var BLACK_FOREST_LABS_AI_API_BASE_URL = "https://api.us1.bfl.ai";
    var BlackForestLabsTextToImageTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("black-forest-labs", BLACK_FOREST_LABS_AI_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          prompt: params.args.inputs
        };
      }
      prepareHeaders(params, binary) {
        const headers = {
          Authorization: params.authMethod !== "provider-key" ? `Bearer ${params.accessToken}` : `X-Key ${params.accessToken}`
        };
        if (!binary) {
          headers["Content-Type"] = "application/json";
        }
        return headers;
      }
      makeRoute(params) {
        if (!params) {
          throw new errors_js_1.InferenceClientInputError("Params are required");
        }
        return `/v1/${params.model}`;
      }
      async getResponse(response, url, headers, outputType) {
        const logger = (0, logger_js_1.getLogger)();
        const urlObj = new URL(response.polling_url);
        for (let step = 0; step < 5; step++) {
          await (0, delay_js_1.delay)(1e3);
          logger.debug(`Polling Black Forest Labs API for the result... ${step + 1}/5`);
          urlObj.searchParams.set("attempt", step.toString(10));
          const resp = await fetch(urlObj, { headers: { "Content-Type": "application/json" } });
          if (!resp.ok) {
            throw new errors_js_1.InferenceClientProviderApiError("Failed to fetch result from black forest labs API", { url: urlObj.toString(), method: "GET", headers: { "Content-Type": "application/json" } }, { requestId: resp.headers.get("x-request-id") ?? "", status: resp.status, body: await resp.text() });
          }
          const payload = await resp.json();
          if (typeof payload === "object" && payload && "status" in payload && typeof payload.status === "string" && payload.status === "Ready" && "result" in payload && typeof payload.result === "object" && payload.result && "sample" in payload.result && typeof payload.result.sample === "string") {
            if (outputType === "json") {
              return payload.result;
            }
            if (outputType === "url") {
              return payload.result.sample;
            }
            const image = await fetch(payload.result.sample);
            return await image.blob();
          }
        }
        throw new errors_js_1.InferenceClientProviderOutputError(`Timed out while waiting for the result from black forest labs API - aborting after 5 attempts`);
      }
    };
    exports2.BlackForestLabsTextToImageTask = BlackForestLabsTextToImageTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/cerebras.js
var require_cerebras = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/cerebras.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CerebrasConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var CerebrasConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("cerebras", "https://api.cerebras.ai");
      }
    };
    exports2.CerebrasConversationalTask = CerebrasConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/cohere.js
var require_cohere = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/cohere.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CohereConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var CohereConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("cohere", "https://api.cohere.com");
      }
      makeRoute() {
        return "/compatibility/v1/chat/completions";
      }
    };
    exports2.CohereConversationalTask = CohereConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/lib/isUrl.js
var require_isUrl = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/lib/isUrl.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isUrl = isUrl;
    function isUrl(modelOrUrl) {
      return /^http(s?):/.test(modelOrUrl) || modelOrUrl.startsWith("/");
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/fal-ai.js
var require_fal_ai = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/fal-ai.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FalAIImageSegmentationTask = exports2.FalAITextToSpeechTask = exports2.FalAIAutomaticSpeechRecognitionTask = exports2.FalAIImageToVideoTask = exports2.FalAITextToVideoTask = exports2.FalAIImageToImageTask = exports2.FalAITextToImageTask = exports2.FAL_AI_SUPPORTED_BLOB_TYPES = void 0;
    var base64FromBytes_js_1 = require_base64FromBytes();
    var isUrl_js_1 = require_isUrl();
    var delay_js_1 = require_delay();
    var omit_js_1 = require_omit();
    var providerHelper_js_1 = require_providerHelper();
    var config_js_1 = require_config();
    var errors_js_1 = require_errors();
    exports2.FAL_AI_SUPPORTED_BLOB_TYPES = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/x-wav"];
    var FalAITask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor(url) {
        super("fal-ai", url || "https://fal.run");
      }
      preparePayload(params) {
        return params.args;
      }
      makeRoute(params) {
        return `/${params.model}`;
      }
      prepareHeaders(params, binary) {
        const headers = {
          Authorization: params.authMethod !== "provider-key" ? `Bearer ${params.accessToken}` : `Key ${params.accessToken}`
        };
        if (!binary) {
          headers["Content-Type"] = "application/json";
        }
        return headers;
      }
    };
    var FalAiQueueTask = class extends FalAITask {
      async getResponseFromQueueApi(response, url, headers) {
        if (!url || !headers) {
          throw new errors_js_1.InferenceClientInputError(`URL and headers are required for ${this.task} task`);
        }
        const requestId = response.request_id;
        if (!requestId) {
          throw new errors_js_1.InferenceClientProviderOutputError(`Received malformed response from Fal.ai ${this.task} API: no request ID found in the response`);
        }
        let status = response.status;
        const parsedUrl = new URL(url);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.host === "router.huggingface.co" ? "/fal-ai" : ""}`;
        const modelId = new URL(response.response_url).pathname;
        const queryParams = parsedUrl.search;
        const statusUrl = `${baseUrl}${modelId}/status${queryParams}`;
        const resultUrl = `${baseUrl}${modelId}${queryParams}`;
        while (status !== "COMPLETED") {
          await (0, delay_js_1.delay)(500);
          const statusResponse = await fetch(statusUrl, { headers });
          if (!statusResponse.ok) {
            throw new errors_js_1.InferenceClientProviderApiError("Failed to fetch response status from fal-ai API", { url: statusUrl, method: "GET" }, {
              requestId: statusResponse.headers.get("x-request-id") ?? "",
              status: statusResponse.status,
              body: await statusResponse.text()
            });
          }
          try {
            status = (await statusResponse.json()).status;
          } catch (error) {
            throw new errors_js_1.InferenceClientProviderOutputError("Failed to parse status response from fal-ai API: received malformed response");
          }
        }
        const resultResponse = await fetch(resultUrl, { headers });
        let result;
        try {
          result = await resultResponse.json();
        } catch (error) {
          throw new errors_js_1.InferenceClientProviderOutputError("Failed to parse result response from fal-ai API: received malformed response");
        }
        return result;
      }
    };
    function buildLoraPath(modelId, adapterWeightsPath) {
      return `${config_js_1.HF_HUB_URL}/${modelId}/resolve/main/${adapterWeightsPath}`;
    }
    var FalAITextToImageTask = class extends FalAITask {
      preparePayload(params) {
        const payload = {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          sync_mode: true,
          prompt: params.args.inputs
        };
        if (params.mapping?.adapter === "lora" && params.mapping.adapterWeightsPath) {
          payload.loras = [
            {
              path: buildLoraPath(params.mapping.hfModelId, params.mapping.adapterWeightsPath),
              scale: 1
            }
          ];
          if (params.mapping.providerId === "fal-ai/lora") {
            payload.model_name = "stabilityai/stable-diffusion-xl-base-1.0";
          }
        }
        return payload;
      }
      async getResponse(response, url, headers, outputType) {
        if (typeof response === "object" && "images" in response && Array.isArray(response.images) && response.images.length > 0 && "url" in response.images[0] && typeof response.images[0].url === "string") {
          if (outputType === "json") {
            return { ...response };
          }
          if (outputType === "url") {
            return response.images[0].url;
          }
          const urlResponse = await fetch(response.images[0].url);
          return await urlResponse.blob();
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Fal.ai text-to-image API");
      }
    };
    exports2.FalAITextToImageTask = FalAITextToImageTask;
    var FalAIImageToImageTask = class extends FalAiQueueTask {
      task;
      constructor() {
        super("https://queue.fal.run");
        this.task = "image-to-image";
      }
      makeRoute(params) {
        if (params.authMethod !== "provider-key") {
          return `/${params.model}?_subdomain=queue`;
        }
        return `/${params.model}`;
      }
      preparePayload(params) {
        const payload = params.args;
        if (params.mapping?.adapter === "lora" && params.mapping.adapterWeightsPath) {
          payload.loras = [
            {
              path: buildLoraPath(params.mapping.hfModelId, params.mapping.adapterWeightsPath),
              scale: 1
            }
          ];
        }
        return payload;
      }
      async preparePayloadAsync(args) {
        const mimeType = args.inputs instanceof Blob ? args.inputs.type : "image/png";
        const imageDataUrl = `data:${mimeType};base64,${(0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(args.inputs instanceof ArrayBuffer ? args.inputs : await args.inputs.arrayBuffer()))}`;
        return {
          ...(0, omit_js_1.omit)(args, ["inputs", "parameters"]),
          image_url: imageDataUrl,
          ...args.parameters,
          ...args,
          // Some fal endpoints (e.g. FLUX.2-dev) expect `image_urls` (array) instead of `image_url`
          image_urls: [imageDataUrl]
        };
      }
      async getResponse(response, url, headers) {
        const result = await this.getResponseFromQueueApi(response, url, headers);
        if (typeof result === "object" && !!result && "images" in result && Array.isArray(result.images) && result.images.length > 0 && typeof result.images[0] === "object" && !!result.images[0] && "url" in result.images[0] && typeof result.images[0].url === "string" && (0, isUrl_js_1.isUrl)(result.images[0].url)) {
          const urlResponse = await fetch(result.images[0].url);
          return await urlResponse.blob();
        } else {
          throw new errors_js_1.InferenceClientProviderOutputError(`Received malformed response from Fal.ai image-to-image API: expected { images: Array<{ url: string }> } result format, got instead: ${JSON.stringify(result)}`);
        }
      }
    };
    exports2.FalAIImageToImageTask = FalAIImageToImageTask;
    var FalAITextToVideoTask = class extends FalAiQueueTask {
      task;
      constructor() {
        super("https://queue.fal.run");
        this.task = "text-to-video";
      }
      makeRoute(params) {
        if (params.authMethod !== "provider-key") {
          return `/${params.model}?_subdomain=queue`;
        }
        return `/${params.model}`;
      }
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          prompt: params.args.inputs
        };
      }
      async getResponse(response, url, headers) {
        const result = await this.getResponseFromQueueApi(response, url, headers);
        if (typeof result === "object" && !!result && "video" in result && typeof result.video === "object" && !!result.video && "url" in result.video && typeof result.video.url === "string" && (0, isUrl_js_1.isUrl)(result.video.url)) {
          const urlResponse = await fetch(result.video.url);
          return await urlResponse.blob();
        } else {
          throw new errors_js_1.InferenceClientProviderOutputError(`Received malformed response from Fal.ai text-to-video API: expected { video: { url: string } } result format, got instead: ${JSON.stringify(result)}`);
        }
      }
    };
    exports2.FalAITextToVideoTask = FalAITextToVideoTask;
    var FalAIImageToVideoTask = class extends FalAiQueueTask {
      task;
      constructor() {
        super("https://queue.fal.run");
        this.task = "image-to-video";
      }
      /** Same queue routing rule as the other Fal queue tasks */
      makeRoute(params) {
        return params.authMethod !== "provider-key" ? `/${params.model}?_subdomain=queue` : `/${params.model}`;
      }
      /** Synchronous case – caller already gave us base64 or a URL */
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          // args.inputs is expected to be a base64 data URI or an URL
          image_url: params.args.image_url
        };
      }
      /** Asynchronous helper – caller gave us a Blob */
      async preparePayloadAsync(args) {
        const mimeType = args.inputs instanceof Blob ? args.inputs.type : "image/png";
        return {
          ...(0, omit_js_1.omit)(args, ["inputs", "parameters"]),
          image_url: `data:${mimeType};base64,${(0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(args.inputs instanceof ArrayBuffer ? args.inputs : await args.inputs.arrayBuffer()))}`,
          ...args.parameters,
          ...args
        };
      }
      /** Queue polling + final download – mirrors Text‑to‑Video */
      async getResponse(response, url, headers) {
        const result = await this.getResponseFromQueueApi(response, url, headers);
        if (typeof result === "object" && result !== null && "video" in result && typeof result.video === "object" && result.video !== null && "url" in result.video && typeof result.video.url === "string" && "url" in result.video && (0, isUrl_js_1.isUrl)(result.video.url)) {
          const urlResponse = await fetch(result.video.url);
          return await urlResponse.blob();
        }
        throw new errors_js_1.InferenceClientProviderOutputError(`Received malformed response from Fal.ai image\u2011to\u2011video API: expected { video: { url: string } }, got: ${JSON.stringify(result)}`);
      }
    };
    exports2.FalAIImageToVideoTask = FalAIImageToVideoTask;
    var FalAIAutomaticSpeechRecognitionTask = class extends FalAITask {
      prepareHeaders(params, binary) {
        const headers = super.prepareHeaders(params, binary);
        headers["Content-Type"] = "application/json";
        return headers;
      }
      async getResponse(response) {
        const res = response;
        if (typeof res?.text !== "string") {
          throw new errors_js_1.InferenceClientProviderOutputError(`Received malformed response from Fal.ai Automatic Speech Recognition API: expected { text: string } format, got instead: ${JSON.stringify(response)}`);
        }
        return { text: res.text };
      }
      async preparePayloadAsync(args) {
        const blob = "data" in args && args.data instanceof Blob ? args.data : "inputs" in args ? args.inputs : void 0;
        const contentType = blob?.type;
        if (!contentType) {
          throw new errors_js_1.InferenceClientInputError(`Unable to determine the input's content-type. Make sure your are passing a Blob when using provider fal-ai.`);
        }
        if (!exports2.FAL_AI_SUPPORTED_BLOB_TYPES.includes(contentType)) {
          throw new errors_js_1.InferenceClientInputError(`Provider fal-ai does not support blob type ${contentType} - supported content types are: ${exports2.FAL_AI_SUPPORTED_BLOB_TYPES.join(", ")}`);
        }
        const base64audio = (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(await blob.arrayBuffer()));
        return {
          ..."data" in args ? (0, omit_js_1.omit)(args, "data") : (0, omit_js_1.omit)(args, "inputs"),
          audio_url: `data:${contentType};base64,${base64audio}`
        };
      }
    };
    exports2.FalAIAutomaticSpeechRecognitionTask = FalAIAutomaticSpeechRecognitionTask;
    var FalAITextToSpeechTask = class extends FalAITask {
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          text: params.args.inputs
        };
      }
      async getResponse(response) {
        const res = response;
        if (typeof res?.audio?.url !== "string") {
          throw new errors_js_1.InferenceClientProviderOutputError(`Received malformed response from Fal.ai Text-to-Speech API: expected { audio: { url: string } } format, got instead: ${JSON.stringify(response)}`);
        }
        const urlResponse = await fetch(res.audio.url);
        if (!urlResponse.ok) {
          throw new errors_js_1.InferenceClientProviderApiError(`Failed to fetch audio from ${res.audio.url}: ${urlResponse.statusText}`, { url: res.audio.url, method: "GET", headers: { "Content-Type": "application/json" } }, {
            requestId: urlResponse.headers.get("x-request-id") ?? "",
            status: urlResponse.status,
            body: await urlResponse.text()
          });
        }
        try {
          return await urlResponse.blob();
        } catch (error) {
          throw new errors_js_1.InferenceClientProviderApiError(`Failed to fetch audio from ${res.audio.url}: ${error instanceof Error ? error.message : String(error)}`, { url: res.audio.url, method: "GET", headers: { "Content-Type": "application/json" } }, {
            requestId: urlResponse.headers.get("x-request-id") ?? "",
            status: urlResponse.status,
            body: await urlResponse.text()
          });
        }
      }
    };
    exports2.FalAITextToSpeechTask = FalAITextToSpeechTask;
    var FalAIImageSegmentationTask = class extends FalAiQueueTask {
      task;
      constructor() {
        super("https://queue.fal.run");
        this.task = "image-segmentation";
      }
      makeRoute(params) {
        if (params.authMethod !== "provider-key") {
          return `/${params.model}?_subdomain=queue`;
        }
        return `/${params.model}`;
      }
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          sync_mode: true
        };
      }
      async preparePayloadAsync(args) {
        const blob = "data" in args && args.data instanceof Blob ? args.data : "inputs" in args ? args.inputs : void 0;
        const mimeType = blob instanceof Blob ? blob.type : "image/png";
        const base64Image = (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(blob instanceof ArrayBuffer ? blob : await blob.arrayBuffer()));
        return {
          ...(0, omit_js_1.omit)(args, ["inputs", "parameters", "data"]),
          ...args.parameters,
          ...args,
          image_url: `data:${mimeType};base64,${base64Image}`,
          sync_mode: true
        };
      }
      async getResponse(response, url, headers) {
        const result = await this.getResponseFromQueueApi(response, url, headers);
        if (typeof result === "object" && result !== null && "image" in result && typeof result.image === "object" && result.image !== null && "url" in result.image && typeof result.image.url === "string") {
          const maskResponse = await fetch(result.image.url);
          if (!maskResponse.ok) {
            throw new errors_js_1.InferenceClientProviderApiError(`Failed to fetch segmentation mask from ${result.image.url}`, { url: result.image.url, method: "GET" }, {
              requestId: maskResponse.headers.get("x-request-id") ?? "",
              status: maskResponse.status,
              body: await maskResponse.text()
            });
          }
          const maskBlob = await maskResponse.blob();
          const maskArrayBuffer = await maskBlob.arrayBuffer();
          const maskBase64 = (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(maskArrayBuffer));
          return [
            {
              label: "mask",
              // placeholder label, as Fal does not provide labels in the response(?)
              score: 1,
              // placeholder score, as Fal does not provide scores in the response(?)
              mask: maskBase64
            }
          ];
        }
        throw new errors_js_1.InferenceClientProviderOutputError(`Received malformed response from Fal.ai image-segmentation API: expected { image: { url: string } } format, got instead: ${JSON.stringify(response)}`);
      }
    };
    exports2.FalAIImageSegmentationTask = FalAIImageSegmentationTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/featherless-ai.js
var require_featherless_ai = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/featherless-ai.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FeatherlessAITextGenerationTask = exports2.FeatherlessAIConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var omit_js_1 = require_omit();
    var errors_js_1 = require_errors();
    var FEATHERLESS_API_BASE_URL = "https://api.featherless.ai";
    var FeatherlessAIConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("featherless-ai", FEATHERLESS_API_BASE_URL);
      }
    };
    exports2.FeatherlessAIConversationalTask = FeatherlessAIConversationalTask;
    var FeatherlessAITextGenerationTask = class extends providerHelper_js_1.BaseTextGenerationTask {
      constructor() {
        super("featherless-ai", FEATHERLESS_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          model: params.model,
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters ? {
            max_tokens: params.args.parameters.max_new_tokens,
            ...(0, omit_js_1.omit)(params.args.parameters, "max_new_tokens")
          } : void 0,
          prompt: params.args.inputs
        };
      }
      async getResponse(response) {
        if (typeof response === "object" && "choices" in response && Array.isArray(response?.choices) && typeof response?.model === "string") {
          const completion = response.choices[0];
          return {
            generated_text: completion.text
          };
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Featherless AI text generation API");
      }
    };
    exports2.FeatherlessAITextGenerationTask = FeatherlessAITextGenerationTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/fireworks-ai.js
var require_fireworks_ai = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/fireworks-ai.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FireworksConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var FireworksConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("fireworks-ai", "https://api.fireworks.ai");
      }
      makeRoute() {
        return "/inference/v1/chat/completions";
      }
    };
    exports2.FireworksConversationalTask = FireworksConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/groq.js
var require_groq = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/groq.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GroqConversationalTask = exports2.GroqTextGenerationTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var GROQ_API_BASE_URL = "https://api.groq.com";
    var GroqTextGenerationTask = class extends providerHelper_js_1.BaseTextGenerationTask {
      constructor() {
        super("groq", GROQ_API_BASE_URL);
      }
      makeRoute() {
        return "/openai/v1/chat/completions";
      }
    };
    exports2.GroqTextGenerationTask = GroqTextGenerationTask;
    var GroqConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("groq", GROQ_API_BASE_URL);
      }
      makeRoute() {
        return "/openai/v1/chat/completions";
      }
    };
    exports2.GroqConversationalTask = GroqConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/hyperbolic.js
var require_hyperbolic = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/hyperbolic.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HyperbolicTextToImageTask = exports2.HyperbolicTextGenerationTask = exports2.HyperbolicConversationalTask = void 0;
    var omit_js_1 = require_omit();
    var providerHelper_js_1 = require_providerHelper();
    var errors_js_1 = require_errors();
    var HYPERBOLIC_API_BASE_URL = "https://api.hyperbolic.xyz";
    var HyperbolicConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("hyperbolic", HYPERBOLIC_API_BASE_URL);
      }
    };
    exports2.HyperbolicConversationalTask = HyperbolicConversationalTask;
    var HyperbolicTextGenerationTask = class extends providerHelper_js_1.BaseTextGenerationTask {
      constructor() {
        super("hyperbolic", HYPERBOLIC_API_BASE_URL);
      }
      makeRoute() {
        return "v1/chat/completions";
      }
      preparePayload(params) {
        return {
          messages: [{ content: params.args.inputs, role: "user" }],
          ...params.args.parameters ? {
            max_tokens: params.args.parameters.max_new_tokens,
            ...(0, omit_js_1.omit)(params.args.parameters, "max_new_tokens")
          } : void 0,
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          model: params.model
        };
      }
      async getResponse(response) {
        if (typeof response === "object" && "choices" in response && Array.isArray(response?.choices) && typeof response?.model === "string") {
          const completion = response.choices[0];
          return {
            generated_text: completion.message.content
          };
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Hyperbolic text generation API");
      }
    };
    exports2.HyperbolicTextGenerationTask = HyperbolicTextGenerationTask;
    var HyperbolicTextToImageTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("hyperbolic", HYPERBOLIC_API_BASE_URL);
      }
      makeRoute(params) {
        void params;
        return `/v1/images/generations`;
      }
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          prompt: params.args.inputs,
          model_name: params.model
        };
      }
      async getResponse(response, url, headers, outputType) {
        if (typeof response === "object" && "images" in response && Array.isArray(response.images) && response.images[0] && typeof response.images[0].image === "string") {
          if (outputType === "json") {
            return { ...response };
          }
          if (outputType === "url") {
            return `data:image/jpeg;base64,${response.images[0].image}`;
          }
          return fetch(`data:image/jpeg;base64,${response.images[0].image}`).then((res) => res.blob());
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Hyperbolic text-to-image API");
      }
    };
    exports2.HyperbolicTextToImageTask = HyperbolicTextToImageTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/nebius.js
var require_nebius = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/nebius.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NebiusFeatureExtractionTask = exports2.NebiusTextToImageTask = exports2.NebiusTextGenerationTask = exports2.NebiusConversationalTask = void 0;
    var omit_js_1 = require_omit();
    var providerHelper_js_1 = require_providerHelper();
    var errors_js_1 = require_errors();
    var NEBIUS_API_BASE_URL = "https://api.studio.nebius.ai";
    var NebiusConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("nebius", NEBIUS_API_BASE_URL);
      }
      preparePayload(params) {
        const payload = super.preparePayload(params);
        const responseFormat = params.args.response_format;
        if (responseFormat?.type === "json_schema" && responseFormat.json_schema?.schema) {
          payload["guided_json"] = responseFormat.json_schema.schema;
        }
        return payload;
      }
    };
    exports2.NebiusConversationalTask = NebiusConversationalTask;
    var NebiusTextGenerationTask = class extends providerHelper_js_1.BaseTextGenerationTask {
      constructor() {
        super("nebius", NEBIUS_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          ...params.args,
          model: params.model,
          prompt: params.args.inputs
        };
      }
      async getResponse(response) {
        if (typeof response === "object" && "choices" in response && Array.isArray(response?.choices) && response.choices.length > 0 && typeof response.choices[0]?.text === "string") {
          return {
            generated_text: response.choices[0].text
          };
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Nebius text generation API");
      }
    };
    exports2.NebiusTextGenerationTask = NebiusTextGenerationTask;
    var NebiusTextToImageTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("nebius", NEBIUS_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          response_format: "b64_json",
          prompt: params.args.inputs,
          model: params.model
        };
      }
      makeRoute() {
        return "v1/images/generations";
      }
      async getResponse(response, url, headers, outputType) {
        if (typeof response === "object" && "data" in response && Array.isArray(response.data) && response.data.length > 0 && "b64_json" in response.data[0] && typeof response.data[0].b64_json === "string") {
          if (outputType === "json") {
            return { ...response };
          }
          const base64Data = response.data[0].b64_json;
          if (outputType === "url") {
            return `data:image/jpeg;base64,${base64Data}`;
          }
          return fetch(`data:image/jpeg;base64,${base64Data}`).then((res) => res.blob());
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Nebius text-to-image API");
      }
    };
    exports2.NebiusTextToImageTask = NebiusTextToImageTask;
    var NebiusFeatureExtractionTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("nebius", NEBIUS_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          input: params.args.inputs,
          model: params.model
        };
      }
      makeRoute() {
        return "v1/embeddings";
      }
      async getResponse(response) {
        return response.data.map((item) => item.embedding);
      }
    };
    exports2.NebiusFeatureExtractionTask = NebiusFeatureExtractionTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/novita.js
var require_novita = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/novita.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NovitaTextToVideoTask = exports2.NovitaConversationalTask = exports2.NovitaTextGenerationTask = void 0;
    var isUrl_js_1 = require_isUrl();
    var delay_js_1 = require_delay();
    var omit_js_1 = require_omit();
    var providerHelper_js_1 = require_providerHelper();
    var errors_js_1 = require_errors();
    var NOVITA_API_BASE_URL = "https://api.novita.ai";
    var NovitaTextGenerationTask = class extends providerHelper_js_1.BaseTextGenerationTask {
      constructor() {
        super("novita", NOVITA_API_BASE_URL);
      }
      makeRoute() {
        return "/v3/openai/chat/completions";
      }
    };
    exports2.NovitaTextGenerationTask = NovitaTextGenerationTask;
    var NovitaConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("novita", NOVITA_API_BASE_URL);
      }
      makeRoute() {
        return "/v3/openai/chat/completions";
      }
    };
    exports2.NovitaConversationalTask = NovitaConversationalTask;
    var NovitaTextToVideoTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("novita", NOVITA_API_BASE_URL);
      }
      makeRoute(params) {
        return `/v3/async/${params.model}`;
      }
      preparePayload(params) {
        const { num_inference_steps, ...restParameters } = params.args.parameters ?? {};
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...restParameters,
          steps: num_inference_steps,
          prompt: params.args.inputs
        };
      }
      async getResponse(response, url, headers) {
        if (!url || !headers) {
          throw new errors_js_1.InferenceClientInputError("URL and headers are required for text-to-video task");
        }
        const taskId = response.task_id;
        if (!taskId) {
          throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Novita text-to-video API: no task ID found in the response");
        }
        const parsedUrl = new URL(url);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.host === "router.huggingface.co" ? "/novita" : ""}`;
        const resultUrl = `${baseUrl}/v3/async/task-result?task_id=${taskId}`;
        let status = "";
        let taskResult;
        while (status !== "TASK_STATUS_SUCCEED" && status !== "TASK_STATUS_FAILED") {
          await (0, delay_js_1.delay)(500);
          const resultResponse = await fetch(resultUrl, { headers });
          if (!resultResponse.ok) {
            throw new errors_js_1.InferenceClientProviderApiError("Failed to fetch task result", { url: resultUrl, method: "GET", headers }, {
              requestId: resultResponse.headers.get("x-request-id") ?? "",
              status: resultResponse.status,
              body: await resultResponse.text()
            });
          }
          try {
            taskResult = await resultResponse.json();
            if (taskResult && typeof taskResult === "object" && "task" in taskResult && taskResult.task && typeof taskResult.task === "object" && "status" in taskResult.task && typeof taskResult.task.status === "string") {
              status = taskResult.task.status;
            } else {
              throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Novita text-to-video API: failed to get task status");
            }
          } catch (error) {
            throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Novita text-to-video API: failed to parse task result");
          }
        }
        if (status === "TASK_STATUS_FAILED") {
          throw new errors_js_1.InferenceClientProviderOutputError("Novita text-to-video task failed");
        }
        if (typeof taskResult === "object" && !!taskResult && "videos" in taskResult && typeof taskResult.videos === "object" && !!taskResult.videos && Array.isArray(taskResult.videos) && taskResult.videos.length > 0 && "video_url" in taskResult.videos[0] && typeof taskResult.videos[0].video_url === "string" && (0, isUrl_js_1.isUrl)(taskResult.videos[0].video_url)) {
          const urlResponse = await fetch(taskResult.videos[0].video_url);
          return await urlResponse.blob();
        } else {
          throw new errors_js_1.InferenceClientProviderOutputError(`Received malformed response from Novita text-to-video API: expected { videos: [{ video_url: string }] } format, got instead: ${JSON.stringify(taskResult)}`);
        }
      }
    };
    exports2.NovitaTextToVideoTask = NovitaTextToVideoTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/nscale.js
var require_nscale = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/nscale.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NscaleTextToImageTask = exports2.NscaleConversationalTask = void 0;
    var omit_js_1 = require_omit();
    var providerHelper_js_1 = require_providerHelper();
    var errors_js_1 = require_errors();
    var NSCALE_API_BASE_URL = "https://inference.api.nscale.com";
    var NscaleConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("nscale", NSCALE_API_BASE_URL);
      }
    };
    exports2.NscaleConversationalTask = NscaleConversationalTask;
    var NscaleTextToImageTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("nscale", NSCALE_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          response_format: "b64_json",
          prompt: params.args.inputs,
          model: params.model
        };
      }
      makeRoute() {
        return "v1/images/generations";
      }
      async getResponse(response, url, headers, outputType) {
        if (typeof response === "object" && "data" in response && Array.isArray(response.data) && response.data.length > 0 && "b64_json" in response.data[0] && typeof response.data[0].b64_json === "string") {
          if (outputType === "json") {
            return { ...response };
          }
          const base64Data = response.data[0].b64_json;
          if (outputType === "url") {
            return `data:image/jpeg;base64,${base64Data}`;
          }
          return fetch(`data:image/jpeg;base64,${base64Data}`).then((res) => res.blob());
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Nscale text-to-image API");
      }
    };
    exports2.NscaleTextToImageTask = NscaleTextToImageTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/openai.js
var require_openai = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/openai.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OpenAIConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var OPENAI_API_BASE_URL = "https://api.openai.com";
    var OpenAIConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("openai", OPENAI_API_BASE_URL, true);
      }
    };
    exports2.OpenAIConversationalTask = OpenAIConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/ovhcloud.js
var require_ovhcloud = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/ovhcloud.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OvhCloudTextGenerationTask = exports2.OvhCloudConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var omit_js_1 = require_omit();
    var errors_js_1 = require_errors();
    var OVHCLOUD_API_BASE_URL = "https://oai.endpoints.kepler.ai.cloud.ovh.net";
    var OvhCloudConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("ovhcloud", OVHCLOUD_API_BASE_URL);
      }
    };
    exports2.OvhCloudConversationalTask = OvhCloudConversationalTask;
    var OvhCloudTextGenerationTask = class extends providerHelper_js_1.BaseTextGenerationTask {
      constructor() {
        super("ovhcloud", OVHCLOUD_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          model: params.model,
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters ? {
            max_tokens: params.args.parameters.max_new_tokens,
            ...(0, omit_js_1.omit)(params.args.parameters, "max_new_tokens")
          } : void 0,
          prompt: params.args.inputs
        };
      }
      async getResponse(response) {
        if (typeof response === "object" && "choices" in response && Array.isArray(response?.choices) && typeof response?.model === "string") {
          const completion = response.choices[0];
          return {
            generated_text: completion.text
          };
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from OVHcloud text generation API");
      }
    };
    exports2.OvhCloudTextGenerationTask = OvhCloudTextGenerationTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/publicai.js
var require_publicai = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/publicai.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PublicAIConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var PublicAIConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("publicai", "https://api.publicai.co");
      }
    };
    exports2.PublicAIConversationalTask = PublicAIConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/replicate.js
var require_replicate = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/replicate.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ReplicateImageToImageTask = exports2.ReplicateAutomaticSpeechRecognitionTask = exports2.ReplicateTextToVideoTask = exports2.ReplicateTextToSpeechTask = exports2.ReplicateTextToImageTask = void 0;
    var errors_js_1 = require_errors();
    var isUrl_js_1 = require_isUrl();
    var omit_js_1 = require_omit();
    var providerHelper_js_1 = require_providerHelper();
    var base64FromBytes_js_1 = require_base64FromBytes();
    var ReplicateTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor(url) {
        super("replicate", url || "https://api.replicate.com");
      }
      makeRoute(params) {
        if (params.model.includes(":")) {
          return "v1/predictions";
        }
        return `v1/models/${params.model}/predictions`;
      }
      preparePayload(params) {
        return {
          input: {
            ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
            ...params.args.parameters,
            prompt: params.args.inputs
          },
          version: params.model.includes(":") ? params.model.split(":")[1] : void 0
        };
      }
      prepareHeaders(params, binary) {
        const headers = { Authorization: `Bearer ${params.accessToken}`, Prefer: "wait" };
        if (!binary) {
          headers["Content-Type"] = "application/json";
        }
        return headers;
      }
      makeUrl(params) {
        const baseUrl = this.makeBaseUrl(params);
        if (params.model.includes(":")) {
          return `${baseUrl}/v1/predictions`;
        }
        return `${baseUrl}/v1/models/${params.model}/predictions`;
      }
    };
    var ReplicateTextToImageTask = class extends ReplicateTask {
      preparePayload(params) {
        return {
          input: {
            ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
            ...params.args.parameters,
            prompt: params.args.inputs,
            lora_weights: params.mapping?.adapter === "lora" && params.mapping.adapterWeightsPath ? `https://huggingface.co/${params.mapping.hfModelId}` : void 0
          },
          version: params.model.includes(":") ? params.model.split(":")[1] : void 0
        };
      }
      async getResponse(res, url, headers, outputType) {
        void url;
        void headers;
        if (typeof res === "object" && "output" in res && typeof res.output === "string" && (0, isUrl_js_1.isUrl)(res.output)) {
          if (outputType === "json") {
            return { ...res };
          }
          if (outputType === "url") {
            return res.output;
          }
          const urlResponse = await fetch(res.output);
          return await urlResponse.blob();
        }
        if (typeof res === "object" && "output" in res && Array.isArray(res.output) && res.output.length > 0 && typeof res.output[0] === "string") {
          if (outputType === "json") {
            return { ...res };
          }
          if (outputType === "url") {
            return res.output[0];
          }
          const urlResponse = await fetch(res.output[0]);
          return await urlResponse.blob();
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Replicate text-to-image API");
      }
    };
    exports2.ReplicateTextToImageTask = ReplicateTextToImageTask;
    var ReplicateTextToSpeechTask = class extends ReplicateTask {
      preparePayload(params) {
        const payload = super.preparePayload(params);
        const input = payload["input"];
        if (typeof input === "object" && input !== null && "prompt" in input) {
          const inputObj = input;
          inputObj["text"] = inputObj["prompt"];
          delete inputObj["prompt"];
        }
        return payload;
      }
      async getResponse(response) {
        if (response instanceof Blob) {
          return response;
        }
        if (response && typeof response === "object") {
          if ("output" in response) {
            if (typeof response.output === "string") {
              const urlResponse = await fetch(response.output);
              return await urlResponse.blob();
            } else if (Array.isArray(response.output)) {
              const urlResponse = await fetch(response.output[0]);
              return await urlResponse.blob();
            }
          }
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Replicate text-to-speech API");
      }
    };
    exports2.ReplicateTextToSpeechTask = ReplicateTextToSpeechTask;
    var ReplicateTextToVideoTask = class extends ReplicateTask {
      async getResponse(response) {
        if (typeof response === "object" && !!response && "output" in response && typeof response.output === "string" && (0, isUrl_js_1.isUrl)(response.output)) {
          const urlResponse = await fetch(response.output);
          return await urlResponse.blob();
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Replicate text-to-video API");
      }
    };
    exports2.ReplicateTextToVideoTask = ReplicateTextToVideoTask;
    var ReplicateAutomaticSpeechRecognitionTask = class extends ReplicateTask {
      preparePayload(params) {
        return {
          input: {
            ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
            ...params.args.parameters,
            audio: params.args.inputs
            // This will be processed in preparePayloadAsync
          },
          version: params.model.includes(":") ? params.model.split(":")[1] : void 0
        };
      }
      async preparePayloadAsync(args) {
        const blob = "data" in args && args.data instanceof Blob ? args.data : "inputs" in args ? args.inputs : void 0;
        if (!blob || !(blob instanceof Blob)) {
          throw new Error("Audio input must be a Blob");
        }
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const base64 = (0, base64FromBytes_js_1.base64FromBytes)(bytes);
        const audioInput = `data:${blob.type || "audio/wav"};base64,${base64}`;
        return {
          ..."data" in args ? (0, omit_js_1.omit)(args, "data") : (0, omit_js_1.omit)(args, "inputs"),
          inputs: audioInput
        };
      }
      async getResponse(response) {
        if (typeof response?.output === "string")
          return { text: response.output };
        if (Array.isArray(response?.output) && typeof response.output[0] === "string")
          return { text: response.output[0] };
        const out = response?.output;
        if (out && typeof out === "object") {
          if (typeof out.transcription === "string")
            return { text: out.transcription };
          if (typeof out.translation === "string")
            return { text: out.translation };
          if (typeof out.txt_file === "string") {
            const r = await fetch(out.txt_file);
            return { text: await r.text() };
          }
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Replicate automatic-speech-recognition API");
      }
    };
    exports2.ReplicateAutomaticSpeechRecognitionTask = ReplicateAutomaticSpeechRecognitionTask;
    var ReplicateImageToImageTask = class extends ReplicateTask {
      preparePayload(params) {
        return {
          input: {
            ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
            ...params.args.parameters,
            input_image: params.args.inputs,
            // This will be processed in preparePayloadAsync
            lora_weights: params.mapping?.adapter === "lora" && params.mapping.adapterWeightsPath ? `https://huggingface.co/${params.mapping.hfModelId}` : void 0
          },
          version: params.model.includes(":") ? params.model.split(":")[1] : void 0
        };
      }
      async preparePayloadAsync(args) {
        const { inputs, ...restArgs } = args;
        const bytes = new Uint8Array(await inputs.arrayBuffer());
        const base64 = (0, base64FromBytes_js_1.base64FromBytes)(bytes);
        const imageInput = `data:${inputs.type || "image/jpeg"};base64,${base64}`;
        return {
          ...restArgs,
          inputs: imageInput
        };
      }
      async getResponse(response) {
        if (typeof response === "object" && !!response && "output" in response && Array.isArray(response.output) && response.output.length > 0 && typeof response.output[0] === "string") {
          const urlResponse = await fetch(response.output[0]);
          return await urlResponse.blob();
        }
        if (typeof response === "object" && !!response && "output" in response && typeof response.output === "string" && (0, isUrl_js_1.isUrl)(response.output)) {
          const urlResponse = await fetch(response.output);
          return await urlResponse.blob();
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Replicate image-to-image API");
      }
    };
    exports2.ReplicateImageToImageTask = ReplicateImageToImageTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/sambanova.js
var require_sambanova = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/sambanova.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SambanovaFeatureExtractionTask = exports2.SambanovaConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var errors_js_1 = require_errors();
    var SambanovaConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("sambanova", "https://api.sambanova.ai");
      }
      preparePayload(params) {
        const responseFormat = params.args.response_format;
        if (responseFormat?.type === "json_schema" && responseFormat.json_schema) {
          if (responseFormat.json_schema.strict ?? true) {
            responseFormat.json_schema.strict = false;
          }
        }
        const payload = super.preparePayload(params);
        return payload;
      }
    };
    exports2.SambanovaConversationalTask = SambanovaConversationalTask;
    var SambanovaFeatureExtractionTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("sambanova", "https://api.sambanova.ai");
      }
      makeRoute() {
        return `/v1/embeddings`;
      }
      async getResponse(response) {
        if (typeof response === "object" && "data" in response && Array.isArray(response.data)) {
          return response.data.map((item) => item.embedding);
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Sambanova feature-extraction (embeddings) API");
      }
      preparePayload(params) {
        return {
          model: params.model,
          input: params.args.inputs,
          ...params.args
        };
      }
    };
    exports2.SambanovaFeatureExtractionTask = SambanovaFeatureExtractionTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/scaleway.js
var require_scaleway = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/scaleway.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ScalewayFeatureExtractionTask = exports2.ScalewayTextGenerationTask = exports2.ScalewayConversationalTask = void 0;
    var errors_js_1 = require_errors();
    var providerHelper_js_1 = require_providerHelper();
    var SCALEWAY_API_BASE_URL = "https://api.scaleway.ai";
    var ScalewayConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("scaleway", SCALEWAY_API_BASE_URL);
      }
    };
    exports2.ScalewayConversationalTask = ScalewayConversationalTask;
    var ScalewayTextGenerationTask = class extends providerHelper_js_1.BaseTextGenerationTask {
      constructor() {
        super("scaleway", SCALEWAY_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          model: params.model,
          ...params.args,
          prompt: params.args.inputs
        };
      }
      async getResponse(response) {
        if (typeof response === "object" && response !== null && "choices" in response && Array.isArray(response.choices) && response.choices.length > 0) {
          const completion = response.choices[0];
          if (typeof completion === "object" && !!completion && "text" in completion && completion.text && typeof completion.text === "string") {
            return {
              generated_text: completion.text
            };
          }
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Scaleway text generation API");
      }
    };
    exports2.ScalewayTextGenerationTask = ScalewayTextGenerationTask;
    var ScalewayFeatureExtractionTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("scaleway", SCALEWAY_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          input: params.args.inputs,
          model: params.model
        };
      }
      makeRoute() {
        return "v1/embeddings";
      }
      async getResponse(response) {
        return response.data.map((item) => item.embedding);
      }
    };
    exports2.ScalewayFeatureExtractionTask = ScalewayFeatureExtractionTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/together.js
var require_together = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/together.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TogetherTextToImageTask = exports2.TogetherTextGenerationTask = exports2.TogetherConversationalTask = void 0;
    var omit_js_1 = require_omit();
    var providerHelper_js_1 = require_providerHelper();
    var errors_js_1 = require_errors();
    var TOGETHER_API_BASE_URL = "https://api.together.xyz";
    var TogetherConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("together", TOGETHER_API_BASE_URL);
      }
      preparePayload(params) {
        const payload = super.preparePayload(params);
        const response_format = payload.response_format;
        if (response_format?.type === "json_schema" && response_format?.json_schema?.schema) {
          payload.response_format = {
            type: "json_schema",
            schema: response_format.json_schema.schema
          };
        }
        return payload;
      }
    };
    exports2.TogetherConversationalTask = TogetherConversationalTask;
    var TogetherTextGenerationTask = class extends providerHelper_js_1.BaseTextGenerationTask {
      constructor() {
        super("together", TOGETHER_API_BASE_URL);
      }
      preparePayload(params) {
        return {
          model: params.model,
          ...params.args,
          prompt: params.args.inputs
        };
      }
      async getResponse(response) {
        if (typeof response === "object" && "choices" in response && Array.isArray(response?.choices) && typeof response?.model === "string") {
          const completion = response.choices[0];
          return {
            generated_text: completion.text
          };
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Together text generation API");
      }
    };
    exports2.TogetherTextGenerationTask = TogetherTextGenerationTask;
    var TogetherTextToImageTask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor() {
        super("together", TOGETHER_API_BASE_URL);
      }
      makeRoute() {
        return "v1/images/generations";
      }
      preparePayload(params) {
        return {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters,
          prompt: params.args.inputs,
          response_format: "base64",
          model: params.model
        };
      }
      async getResponse(response, url, headers, outputType) {
        if (typeof response === "object" && "data" in response && Array.isArray(response.data) && response.data.length > 0 && "b64_json" in response.data[0] && typeof response.data[0].b64_json === "string") {
          if (outputType === "json") {
            return { ...response };
          }
          const base64Data = response.data[0].b64_json;
          if (outputType === "url") {
            return `data:image/jpeg;base64,${base64Data}`;
          }
          return fetch(`data:image/jpeg;base64,${base64Data}`).then((res) => res.blob());
        }
        throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from Together text-to-image API");
      }
    };
    exports2.TogetherTextToImageTask = TogetherTextToImageTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/wavespeed.js
var require_wavespeed = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/wavespeed.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WavespeedAIImageToVideoTask = exports2.WavespeedAIImageToImageTask = exports2.WavespeedAITextToVideoTask = exports2.WavespeedAITextToImageTask = void 0;
    var delay_js_1 = require_delay();
    var omit_js_1 = require_omit();
    var base64FromBytes_js_1 = require_base64FromBytes();
    var providerHelper_js_1 = require_providerHelper();
    var errors_js_1 = require_errors();
    var WAVESPEEDAI_API_BASE_URL = "https://api.wavespeed.ai";
    async function buildImagesField(inputs, hasImages) {
      const base = (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(inputs instanceof ArrayBuffer ? inputs : await inputs.arrayBuffer()));
      const images = Array.isArray(hasImages) && hasImages.every((value) => typeof value === "string") ? hasImages : [base];
      return { base, images };
    }
    var WavespeedAITask = class extends providerHelper_js_1.TaskProviderHelper {
      constructor(url) {
        super("wavespeed", url || WAVESPEEDAI_API_BASE_URL);
      }
      makeRoute(params) {
        return `/api/v3/${params.model}`;
      }
      preparePayload(params) {
        const payload = {
          ...(0, omit_js_1.omit)(params.args, ["inputs", "parameters"]),
          ...params.args.parameters ? (0, omit_js_1.omit)(params.args.parameters, ["images"]) : void 0,
          prompt: params.args.inputs
        };
        if (params.mapping?.adapter === "lora") {
          payload.loras = [
            {
              path: params.mapping.hfModelId,
              scale: 1
              // Default scale value
            }
          ];
        }
        return payload;
      }
      async getResponse(response, url, headers) {
        if (!url || !headers) {
          throw new errors_js_1.InferenceClientInputError("Headers are required for WaveSpeed AI API calls");
        }
        const parsedUrl = new URL(url);
        const resultPath = new URL(response.data.urls.get).pathname;
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.host === "router.huggingface.co" ? "/wavespeed" : ""}`;
        const resultUrl = `${baseUrl}${resultPath}`;
        while (true) {
          const resultResponse = await fetch(resultUrl, { headers });
          if (!resultResponse.ok) {
            throw new errors_js_1.InferenceClientProviderApiError("Failed to fetch response status from WaveSpeed AI API", { url: resultUrl, method: "GET" }, {
              requestId: resultResponse.headers.get("x-request-id") ?? "",
              status: resultResponse.status,
              body: await resultResponse.text()
            });
          }
          const result = await resultResponse.json();
          const taskResult = result.data;
          switch (taskResult.status) {
            case "completed": {
              if (!taskResult.outputs?.[0]) {
                throw new errors_js_1.InferenceClientProviderOutputError("Received malformed response from WaveSpeed AI API: No output URL in completed response");
              }
              const mediaResponse = await fetch(taskResult.outputs[0]);
              if (!mediaResponse.ok) {
                throw new errors_js_1.InferenceClientProviderApiError("Failed to fetch generation output from WaveSpeed AI API", { url: taskResult.outputs[0], method: "GET" }, {
                  requestId: mediaResponse.headers.get("x-request-id") ?? "",
                  status: mediaResponse.status,
                  body: await mediaResponse.text()
                });
              }
              return await mediaResponse.blob();
            }
            case "failed": {
              throw new errors_js_1.InferenceClientProviderOutputError(taskResult.error || "Task failed");
            }
            default: {
              await (0, delay_js_1.delay)(500);
              continue;
            }
          }
        }
      }
    };
    var WavespeedAITextToImageTask = class extends WavespeedAITask {
      constructor() {
        super(WAVESPEEDAI_API_BASE_URL);
      }
    };
    exports2.WavespeedAITextToImageTask = WavespeedAITextToImageTask;
    var WavespeedAITextToVideoTask = class extends WavespeedAITask {
      constructor() {
        super(WAVESPEEDAI_API_BASE_URL);
      }
    };
    exports2.WavespeedAITextToVideoTask = WavespeedAITextToVideoTask;
    var WavespeedAIImageToImageTask = class extends WavespeedAITask {
      constructor() {
        super(WAVESPEEDAI_API_BASE_URL);
      }
      async preparePayloadAsync(args) {
        const hasImages = args.images ?? args.parameters?.images;
        const { base, images } = await buildImagesField(args.inputs, hasImages);
        return { ...args, inputs: args.parameters?.prompt, image: base, images };
      }
    };
    exports2.WavespeedAIImageToImageTask = WavespeedAIImageToImageTask;
    var WavespeedAIImageToVideoTask = class extends WavespeedAITask {
      constructor() {
        super(WAVESPEEDAI_API_BASE_URL);
      }
      async preparePayloadAsync(args) {
        const hasImages = args.images ?? args.parameters?.images;
        const { base, images } = await buildImagesField(args.inputs, hasImages);
        return { ...args, inputs: args.parameters?.prompt, image: base, images };
      }
    };
    exports2.WavespeedAIImageToVideoTask = WavespeedAIImageToVideoTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/providers/zai-org.js
var require_zai_org = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/providers/zai-org.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ZaiConversationalTask = void 0;
    var providerHelper_js_1 = require_providerHelper();
    var ZAI_API_BASE_URL = "https://api.z.ai";
    var ZaiConversationalTask = class extends providerHelper_js_1.BaseConversationalTask {
      constructor() {
        super("zai-org", ZAI_API_BASE_URL);
      }
      prepareHeaders(params, binary) {
        const headers = super.prepareHeaders(params, binary);
        headers["x-source-channel"] = "hugging_face";
        headers["accept-language"] = "en-US,en";
        return headers;
      }
      makeRoute() {
        return "/api/paas/v4/chat/completions";
      }
    };
    exports2.ZaiConversationalTask = ZaiConversationalTask;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/lib/getProviderHelper.js
var require_getProviderHelper = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/lib/getProviderHelper.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PROVIDERS = void 0;
    exports2.getProviderHelper = getProviderHelper;
    var Baseten = __importStar(require_baseten());
    var Clarifai = __importStar(require_clarifai());
    var BlackForestLabs = __importStar(require_black_forest_labs());
    var Cerebras = __importStar(require_cerebras());
    var Cohere = __importStar(require_cohere());
    var FalAI = __importStar(require_fal_ai());
    var FeatherlessAI = __importStar(require_featherless_ai());
    var Fireworks = __importStar(require_fireworks_ai());
    var Groq = __importStar(require_groq());
    var HFInference = __importStar(require_hf_inference());
    var Hyperbolic = __importStar(require_hyperbolic());
    var Nebius = __importStar(require_nebius());
    var Novita = __importStar(require_novita());
    var Nscale = __importStar(require_nscale());
    var OpenAI = __importStar(require_openai());
    var OvhCloud = __importStar(require_ovhcloud());
    var PublicAI = __importStar(require_publicai());
    var Replicate = __importStar(require_replicate());
    var Sambanova = __importStar(require_sambanova());
    var Scaleway = __importStar(require_scaleway());
    var Together = __importStar(require_together());
    var Wavespeed = __importStar(require_wavespeed());
    var Zai = __importStar(require_zai_org());
    var errors_js_1 = require_errors();
    exports2.PROVIDERS = {
      baseten: {
        conversational: new Baseten.BasetenConversationalTask()
      },
      "black-forest-labs": {
        "text-to-image": new BlackForestLabs.BlackForestLabsTextToImageTask()
      },
      cerebras: {
        conversational: new Cerebras.CerebrasConversationalTask()
      },
      clarifai: {
        conversational: new Clarifai.ClarifaiConversationalTask()
      },
      cohere: {
        conversational: new Cohere.CohereConversationalTask()
      },
      "fal-ai": {
        "text-to-image": new FalAI.FalAITextToImageTask(),
        "text-to-speech": new FalAI.FalAITextToSpeechTask(),
        "text-to-video": new FalAI.FalAITextToVideoTask(),
        "image-to-image": new FalAI.FalAIImageToImageTask(),
        "automatic-speech-recognition": new FalAI.FalAIAutomaticSpeechRecognitionTask(),
        "image-segmentation": new FalAI.FalAIImageSegmentationTask(),
        "image-to-video": new FalAI.FalAIImageToVideoTask()
      },
      "featherless-ai": {
        conversational: new FeatherlessAI.FeatherlessAIConversationalTask(),
        "text-generation": new FeatherlessAI.FeatherlessAITextGenerationTask()
      },
      "hf-inference": {
        "text-to-image": new HFInference.HFInferenceTextToImageTask(),
        conversational: new HFInference.HFInferenceConversationalTask(),
        "text-generation": new HFInference.HFInferenceTextGenerationTask(),
        "text-classification": new HFInference.HFInferenceTextClassificationTask(),
        "question-answering": new HFInference.HFInferenceQuestionAnsweringTask(),
        "audio-classification": new HFInference.HFInferenceAudioClassificationTask(),
        "automatic-speech-recognition": new HFInference.HFInferenceAutomaticSpeechRecognitionTask(),
        "fill-mask": new HFInference.HFInferenceFillMaskTask(),
        "feature-extraction": new HFInference.HFInferenceFeatureExtractionTask(),
        "image-classification": new HFInference.HFInferenceImageClassificationTask(),
        "image-segmentation": new HFInference.HFInferenceImageSegmentationTask(),
        "document-question-answering": new HFInference.HFInferenceDocumentQuestionAnsweringTask(),
        "image-to-text": new HFInference.HFInferenceImageToTextTask(),
        "object-detection": new HFInference.HFInferenceObjectDetectionTask(),
        "audio-to-audio": new HFInference.HFInferenceAudioToAudioTask(),
        "zero-shot-image-classification": new HFInference.HFInferenceZeroShotImageClassificationTask(),
        "zero-shot-classification": new HFInference.HFInferenceZeroShotClassificationTask(),
        "image-to-image": new HFInference.HFInferenceImageToImageTask(),
        "sentence-similarity": new HFInference.HFInferenceSentenceSimilarityTask(),
        "table-question-answering": new HFInference.HFInferenceTableQuestionAnsweringTask(),
        "tabular-classification": new HFInference.HFInferenceTabularClassificationTask(),
        "text-to-speech": new HFInference.HFInferenceTextToSpeechTask(),
        "token-classification": new HFInference.HFInferenceTokenClassificationTask(),
        translation: new HFInference.HFInferenceTranslationTask(),
        summarization: new HFInference.HFInferenceSummarizationTask(),
        "visual-question-answering": new HFInference.HFInferenceVisualQuestionAnsweringTask(),
        "tabular-regression": new HFInference.HFInferenceTabularRegressionTask(),
        "text-to-audio": new HFInference.HFInferenceTextToAudioTask()
      },
      "fireworks-ai": {
        conversational: new Fireworks.FireworksConversationalTask()
      },
      groq: {
        conversational: new Groq.GroqConversationalTask(),
        "text-generation": new Groq.GroqTextGenerationTask()
      },
      hyperbolic: {
        "text-to-image": new Hyperbolic.HyperbolicTextToImageTask(),
        conversational: new Hyperbolic.HyperbolicConversationalTask(),
        "text-generation": new Hyperbolic.HyperbolicTextGenerationTask()
      },
      nebius: {
        "text-to-image": new Nebius.NebiusTextToImageTask(),
        conversational: new Nebius.NebiusConversationalTask(),
        "text-generation": new Nebius.NebiusTextGenerationTask(),
        "feature-extraction": new Nebius.NebiusFeatureExtractionTask()
      },
      novita: {
        conversational: new Novita.NovitaConversationalTask(),
        "text-generation": new Novita.NovitaTextGenerationTask(),
        "text-to-video": new Novita.NovitaTextToVideoTask()
      },
      nscale: {
        "text-to-image": new Nscale.NscaleTextToImageTask(),
        conversational: new Nscale.NscaleConversationalTask()
      },
      openai: {
        conversational: new OpenAI.OpenAIConversationalTask()
      },
      ovhcloud: {
        conversational: new OvhCloud.OvhCloudConversationalTask(),
        "text-generation": new OvhCloud.OvhCloudTextGenerationTask()
      },
      publicai: {
        conversational: new PublicAI.PublicAIConversationalTask()
      },
      replicate: {
        "text-to-image": new Replicate.ReplicateTextToImageTask(),
        "text-to-speech": new Replicate.ReplicateTextToSpeechTask(),
        "text-to-video": new Replicate.ReplicateTextToVideoTask(),
        "image-to-image": new Replicate.ReplicateImageToImageTask(),
        "automatic-speech-recognition": new Replicate.ReplicateAutomaticSpeechRecognitionTask()
      },
      sambanova: {
        conversational: new Sambanova.SambanovaConversationalTask(),
        "feature-extraction": new Sambanova.SambanovaFeatureExtractionTask()
      },
      scaleway: {
        conversational: new Scaleway.ScalewayConversationalTask(),
        "text-generation": new Scaleway.ScalewayTextGenerationTask(),
        "feature-extraction": new Scaleway.ScalewayFeatureExtractionTask()
      },
      together: {
        "text-to-image": new Together.TogetherTextToImageTask(),
        conversational: new Together.TogetherConversationalTask(),
        "text-generation": new Together.TogetherTextGenerationTask()
      },
      wavespeed: {
        "text-to-image": new Wavespeed.WavespeedAITextToImageTask(),
        "text-to-video": new Wavespeed.WavespeedAITextToVideoTask(),
        "image-to-image": new Wavespeed.WavespeedAIImageToImageTask(),
        "image-to-video": new Wavespeed.WavespeedAIImageToVideoTask()
      },
      "zai-org": {
        conversational: new Zai.ZaiConversationalTask()
      }
    };
    function getProviderHelper(provider, task) {
      if (provider === "hf-inference" && !task || provider === "auto") {
        return new HFInference.HFInferenceTask();
      }
      if (!task) {
        throw new errors_js_1.InferenceClientInputError("you need to provide a task name when using an external provider, e.g. 'text-to-image'");
      }
      if (!(provider in exports2.PROVIDERS)) {
        throw new errors_js_1.InferenceClientInputError(`Provider '${provider}' not supported. Available providers: ${Object.keys(exports2.PROVIDERS)}`);
      }
      const providerTasks = exports2.PROVIDERS[provider];
      if (!providerTasks || !(task in providerTasks)) {
        throw new errors_js_1.InferenceClientInputError(`Task '${task}' not supported for provider '${provider}'. Available tasks: ${Object.keys(providerTasks ?? {})}`);
      }
      return providerTasks[task];
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/package.js
var require_package = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/package.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PACKAGE_NAME = exports2.PACKAGE_VERSION = void 0;
    exports2.PACKAGE_VERSION = "4.13.5";
    exports2.PACKAGE_NAME = "@huggingface/inference";
  }
});

// node_modules/@huggingface/inference/dist/commonjs/lib/makeRequestOptions.js
var require_makeRequestOptions = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/lib/makeRequestOptions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.makeRequestOptions = makeRequestOptions;
    exports2.makeRequestOptionsFromResolvedModel = makeRequestOptionsFromResolvedModel;
    var config_js_1 = require_config();
    var package_js_1 = require_package();
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var isUrl_js_1 = require_isUrl();
    var errors_js_1 = require_errors();
    var tasks = null;
    async function makeRequestOptions(args, providerHelper, options) {
      const { model: maybeModel } = args;
      const provider = providerHelper.provider;
      const { task } = options ?? {};
      if (args.endpointUrl && provider !== "hf-inference") {
        throw new errors_js_1.InferenceClientInputError(`Cannot use endpointUrl with a third-party provider.`);
      }
      if (maybeModel && (0, isUrl_js_1.isUrl)(maybeModel)) {
        throw new errors_js_1.InferenceClientInputError(`Model URLs are no longer supported. Use endpointUrl instead.`);
      }
      if (args.endpointUrl) {
        return makeRequestOptionsFromResolvedModel(maybeModel ?? args.endpointUrl, providerHelper, args, void 0, options);
      }
      if (!maybeModel && !task) {
        throw new errors_js_1.InferenceClientInputError("No model provided, and no task has been specified.");
      }
      const hfModel = maybeModel ?? await loadDefaultModel(task);
      if (providerHelper.clientSideRoutingOnly && !maybeModel) {
        throw new errors_js_1.InferenceClientInputError(`Provider ${provider} requires a model ID to be passed directly.`);
      }
      const inferenceProviderMapping = providerHelper.clientSideRoutingOnly ? {
        provider,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        providerId: removeProviderPrefix(maybeModel, provider),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        hfModelId: maybeModel,
        status: "live",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        task
      } : await (0, getInferenceProviderMapping_js_1.getInferenceProviderMapping)({
        modelId: hfModel,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        task,
        provider,
        accessToken: args.accessToken
      }, { fetch: options?.fetch });
      if (!inferenceProviderMapping) {
        throw new errors_js_1.InferenceClientInputError(`We have not been able to find inference provider information for model ${hfModel}.`);
      }
      return makeRequestOptionsFromResolvedModel(inferenceProviderMapping.providerId, providerHelper, args, inferenceProviderMapping, options);
    }
    function makeRequestOptionsFromResolvedModel(resolvedModel, providerHelper, args, mapping, options) {
      const { accessToken, endpointUrl, provider: maybeProvider, model, ...remainingArgs } = args;
      void model;
      void maybeProvider;
      const provider = providerHelper.provider;
      const { includeCredentials, task, signal, billTo } = options ?? {};
      const authMethod = (() => {
        if (providerHelper.clientSideRoutingOnly) {
          if (accessToken && accessToken.startsWith("hf_")) {
            throw new errors_js_1.InferenceClientInputError(`Provider ${provider} is closed-source and does not support HF tokens.`);
          }
        }
        if (accessToken) {
          return accessToken.startsWith("hf_") ? "hf-token" : "provider-key";
        }
        if (includeCredentials === "include") {
          return "credentials-include";
        }
        return "none";
      })();
      const modelId = endpointUrl ?? resolvedModel;
      const url = providerHelper.makeUrl({
        authMethod,
        model: modelId,
        task
      });
      const headers = providerHelper.prepareHeaders({
        accessToken,
        authMethod
      }, "data" in args && !!args.data);
      if (billTo) {
        headers[config_js_1.HF_HEADER_X_BILL_TO] = billTo;
      }
      const ownUserAgent = `${package_js_1.PACKAGE_NAME}/${package_js_1.PACKAGE_VERSION}`;
      const userAgent = [ownUserAgent, typeof navigator !== "undefined" ? navigator.userAgent : void 0].filter((x) => x !== void 0).join(" ");
      headers["User-Agent"] = userAgent;
      const body = providerHelper.makeBody({
        args: remainingArgs,
        model: resolvedModel,
        task,
        mapping
      });
      let credentials;
      if (typeof includeCredentials === "string") {
        credentials = includeCredentials;
      } else if (includeCredentials === true) {
        credentials = "include";
      }
      const info = {
        headers,
        method: "POST",
        body,
        ...credentials ? { credentials } : void 0,
        signal
      };
      return { url, info };
    }
    async function loadDefaultModel(task) {
      if (!tasks) {
        tasks = await loadTaskInfo();
      }
      const taskInfo = tasks[task];
      if ((taskInfo?.models.length ?? 0) <= 0) {
        throw new errors_js_1.InferenceClientInputError(`No default model defined for task ${task}, please define the model explicitly.`);
      }
      return taskInfo.models[0].id;
    }
    async function loadTaskInfo() {
      const url = `${config_js_1.HF_HUB_URL}/api/tasks`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new errors_js_1.InferenceClientHubApiError("Failed to load tasks definitions from Hugging Face Hub.", { url, method: "GET" }, { requestId: res.headers.get("x-request-id") ?? "", status: res.status, body: await res.text() });
      }
      return await res.json();
    }
    function removeProviderPrefix(model, provider) {
      if (!model.startsWith(`${provider}/`)) {
        throw new errors_js_1.InferenceClientInputError(`Models from ${provider} must be prefixed by "${provider}/". Got "${model}".`);
      }
      return model.slice(provider.length + 1);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/vendor/fetch-event-source/parse.js
var require_parse = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/vendor/fetch-event-source/parse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getBytes = getBytes;
    exports2.getLines = getLines;
    exports2.getMessages = getMessages;
    async function getBytes(stream, onChunk) {
      const reader = stream.getReader();
      let result;
      while (!(result = await reader.read()).done) {
        onChunk(result.value);
      }
    }
    function getLines(onLine) {
      let buffer;
      let position;
      let fieldLength;
      let discardTrailingNewline = false;
      return function onChunk(arr) {
        if (buffer === void 0) {
          buffer = arr;
          position = 0;
          fieldLength = -1;
        } else {
          buffer = concat(buffer, arr);
        }
        const bufLength = buffer.length;
        let lineStart = 0;
        while (position < bufLength) {
          if (discardTrailingNewline) {
            if (buffer[position] === 10) {
              lineStart = ++position;
            }
            discardTrailingNewline = false;
          }
          let lineEnd = -1;
          for (; position < bufLength && lineEnd === -1; ++position) {
            switch (buffer[position]) {
              case 58:
                if (fieldLength === -1) {
                  fieldLength = position - lineStart;
                }
                break;
              case 13:
                discardTrailingNewline = true;
              // eslint-disable-next-line no-fallthrough
              case 10:
                lineEnd = position;
                break;
            }
          }
          if (lineEnd === -1) {
            break;
          }
          onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
          lineStart = position;
          fieldLength = -1;
        }
        if (lineStart === bufLength) {
          buffer = void 0;
        } else if (lineStart !== 0) {
          buffer = buffer.subarray(lineStart);
          position -= lineStart;
        }
      };
    }
    function getMessages(onId, onRetry, onMessage) {
      let message = newMessage();
      const decoder = new TextDecoder();
      return function onLine(line, fieldLength) {
        if (line.length === 0) {
          onMessage?.(message);
          message = newMessage();
        } else if (fieldLength > 0) {
          const field = decoder.decode(line.subarray(0, fieldLength));
          const valueOffset = fieldLength + (line[fieldLength + 1] === 32 ? 2 : 1);
          const value = decoder.decode(line.subarray(valueOffset));
          switch (field) {
            case "data":
              message.data = message.data ? message.data + "\n" + value : value;
              break;
            case "event":
              message.event = value;
              break;
            case "id":
              onId(message.id = value);
              break;
            case "retry": {
              const retry = parseInt(value, 10);
              if (!isNaN(retry)) {
                onRetry(message.retry = retry);
              }
              break;
            }
          }
        }
      };
    }
    function concat(a, b) {
      const res = new Uint8Array(a.length + b.length);
      res.set(a);
      res.set(b, a.length);
      return res;
    }
    function newMessage() {
      return {
        data: "",
        event: "",
        id: "",
        retry: void 0
      };
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/utils/request.js
var require_request = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/utils/request.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.innerRequest = innerRequest;
    exports2.innerStreamingRequest = innerStreamingRequest;
    var makeRequestOptions_js_1 = require_makeRequestOptions();
    var parse_js_1 = require_parse();
    var errors_js_1 = require_errors();
    function bodyToJson(body) {
      let data = null;
      if (body instanceof Blob || body instanceof ArrayBuffer) {
        data = "[Blob or ArrayBuffer]";
      } else if (typeof body === "string") {
        try {
          data = JSON.parse(body);
        } catch {
          data = body;
        }
      }
      if (data.accessToken) {
        data.accessToken = "[REDACTED]";
      }
      return data;
    }
    async function innerRequest(args, providerHelper, options) {
      const { url, info } = await (0, makeRequestOptions_js_1.makeRequestOptions)(args, providerHelper, options);
      const response = await (options?.fetch ?? fetch)(url, info);
      const requestContext = { url, info };
      if (options?.retry_on_error !== false && response.status === 503) {
        return innerRequest(args, providerHelper, options);
      }
      if (!response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (["application/json", "application/problem+json"].some((ct) => contentType?.startsWith(ct))) {
          const output = await response.json();
          if ([400, 422, 404, 500].includes(response.status) && options?.chatCompletion) {
            throw new errors_js_1.InferenceClientProviderApiError(`Provider ${args.provider} does not seem to support chat completion for model ${args.model} . Error: ${JSON.stringify(output.error)}`, {
              url,
              method: info.method ?? "GET",
              headers: info.headers,
              body: bodyToJson(info.body)
            }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: output });
          }
          if (typeof output.error === "string" || typeof output.detail === "string" || typeof output.message === "string") {
            throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: ${output.error ?? output.detail ?? output.message}`, {
              url,
              method: info.method ?? "GET",
              headers: info.headers,
              body: bodyToJson(info.body)
            }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: output });
          } else {
            throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: an HTTP error occurred when requesting the provider.`, {
              url,
              method: info.method ?? "GET",
              headers: info.headers,
              body: bodyToJson(info.body)
            }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: output });
          }
        }
        const message = contentType?.startsWith("text/plain;") ? await response.text() : void 0;
        throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: ${message ?? "an HTTP error occurred when requesting the provider"}`, {
          url,
          method: info.method ?? "GET",
          headers: info.headers,
          body: bodyToJson(info.body)
        }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: message ?? "" });
      }
      if (response.headers.get("Content-Type")?.startsWith("application/json")) {
        const data = await response.json();
        return { data, requestContext };
      }
      const blob = await response.blob();
      return { data: blob, requestContext };
    }
    async function* innerStreamingRequest(args, providerHelper, options) {
      const { url, info } = await (0, makeRequestOptions_js_1.makeRequestOptions)({ ...args, stream: true }, providerHelper, options);
      const response = await (options?.fetch ?? fetch)(url, info);
      if (options?.retry_on_error !== false && response.status === 503) {
        return yield* innerStreamingRequest(args, providerHelper, options);
      }
      if (!response.ok) {
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
          const output = await response.json();
          if ([400, 422, 404, 500].includes(response.status) && options?.chatCompletion) {
            throw new errors_js_1.InferenceClientProviderApiError(`Provider ${args.provider} does not seem to support chat completion for model ${args.model} . Error: ${JSON.stringify(output.error)}`, {
              url,
              method: info.method ?? "GET",
              headers: info.headers,
              body: bodyToJson(info.body)
            }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: output });
          }
          if (typeof output.error === "string") {
            throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: ${output.error}`, {
              url,
              method: info.method ?? "GET",
              headers: info.headers,
              body: bodyToJson(info.body)
            }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: output });
          }
          if (output.error && "message" in output.error && typeof output.error.message === "string") {
            throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: ${output.error.message}`, {
              url,
              method: info.method ?? "GET",
              headers: info.headers,
              body: bodyToJson(info.body)
            }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: output });
          }
          if (typeof output.message === "string") {
            throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: ${output.message}`, {
              url,
              method: info.method ?? "GET",
              headers: info.headers,
              body: bodyToJson(info.body)
            }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: output });
          }
        }
        throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: an HTTP error occurred when requesting the provider.`, {
          url,
          method: info.method ?? "GET",
          headers: info.headers,
          body: bodyToJson(info.body)
        }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: "" });
      }
      if (!response.headers.get("content-type")?.startsWith("text/event-stream")) {
        throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: server does not support event stream content type, it returned ` + response.headers.get("content-type"), {
          url,
          method: info.method ?? "GET",
          headers: info.headers,
          body: bodyToJson(info.body)
        }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: "" });
      }
      if (!response.body) {
        return;
      }
      const reader = response.body.getReader();
      let events = [];
      const onEvent = (event) => {
        events.push(event);
      };
      const onChunk = (0, parse_js_1.getLines)((0, parse_js_1.getMessages)(() => {
      }, () => {
      }, onEvent));
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            return;
          }
          onChunk(value);
          for (const event of events) {
            if (event.data.length > 0) {
              if (event.data === "[DONE]") {
                return;
              }
              const data = JSON.parse(event.data);
              if (typeof data === "object" && data !== null && "error" in data) {
                const errorStr = typeof data.error === "string" ? data.error : typeof data.error === "object" && data.error && "message" in data.error && typeof data.error.message === "string" ? data.error.message : JSON.stringify(data.error);
                throw new errors_js_1.InferenceClientProviderApiError(`Failed to perform inference: an occurred while streaming the response: ${errorStr}`, {
                  url,
                  method: info.method ?? "GET",
                  headers: info.headers,
                  body: bodyToJson(info.body)
                }, { requestId: response.headers.get("x-request-id") ?? "", status: response.status, body: data });
              }
              yield data;
            }
          }
          events = [];
        }
      } finally {
        reader.releaseLock();
      }
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/custom/request.js
var require_request2 = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/custom/request.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.request = request;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var logger_js_1 = require_logger();
    async function request(args, options) {
      const logger = (0, logger_js_1.getLogger)();
      logger.warn("The request method is deprecated and will be removed in a future version of huggingface.js. Use specific task functions instead.");
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, options?.task);
      const result = await (0, request_js_1.innerRequest)(args, providerHelper, options);
      return result.data;
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/custom/streamingRequest.js
var require_streamingRequest = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/custom/streamingRequest.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.streamingRequest = streamingRequest;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var logger_js_1 = require_logger();
    async function* streamingRequest(args, options) {
      const logger = (0, logger_js_1.getLogger)();
      logger.warn("The streamingRequest method is deprecated and will be removed in a future version of huggingface.js. Use specific task functions instead.");
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, options?.task);
      yield* (0, request_js_1.innerStreamingRequest)(args, providerHelper, options);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/audio/utils.js
var require_utils = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/audio/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.preparePayload = preparePayload;
    var omit_js_1 = require_omit();
    function preparePayload(args) {
      return "data" in args ? args : {
        ...(0, omit_js_1.omit)(args, "inputs"),
        data: args.inputs
      };
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/audio/audioClassification.js
var require_audioClassification = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/audio/audioClassification.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.audioClassification = audioClassification;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var utils_js_1 = require_utils();
    async function audioClassification(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "audio-classification");
      const payload = (0, utils_js_1.preparePayload)(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "audio-classification"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/audio/audioToAudio.js
var require_audioToAudio = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/audio/audioToAudio.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.audioToAudio = audioToAudio;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var utils_js_1 = require_utils();
    async function audioToAudio(args, options) {
      const model = "inputs" in args ? args.model : void 0;
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, model);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "audio-to-audio");
      const payload = (0, utils_js_1.preparePayload)(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "audio-to-audio"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/audio/automaticSpeechRecognition.js
var require_automaticSpeechRecognition = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/audio/automaticSpeechRecognition.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.automaticSpeechRecognition = automaticSpeechRecognition;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function automaticSpeechRecognition(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "automatic-speech-recognition");
      const payload = await providerHelper.preparePayloadAsync(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "automatic-speech-recognition"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/audio/textToSpeech.js
var require_textToSpeech = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/audio/textToSpeech.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.textToSpeech = textToSpeech;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function textToSpeech(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "text-to-speech");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "text-to-speech"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/utils.js
var require_utils2 = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.preparePayload = preparePayload;
    var omit_js_1 = require_omit();
    function preparePayload(args) {
      return "data" in args ? args : { ...(0, omit_js_1.omit)(args, "inputs"), data: args.inputs };
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageClassification.js
var require_imageClassification = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageClassification.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.imageClassification = imageClassification;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var utils_js_1 = require_utils2();
    async function imageClassification(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "image-classification");
      const payload = (0, utils_js_1.preparePayload)(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "image-classification"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageSegmentation.js
var require_imageSegmentation = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageSegmentation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.imageSegmentation = imageSegmentation;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var makeRequestOptions_js_1 = require_makeRequestOptions();
    async function imageSegmentation(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "image-segmentation");
      const payload = await providerHelper.preparePayloadAsync(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "image-segmentation"
      });
      const { url, info } = await (0, makeRequestOptions_js_1.makeRequestOptions)(args, providerHelper, { ...options, task: "image-segmentation" });
      return providerHelper.getResponse(res, url, info.headers);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageToImage.js
var require_imageToImage = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageToImage.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.imageToImage = imageToImage;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var makeRequestOptions_js_1 = require_makeRequestOptions();
    async function imageToImage(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "image-to-image");
      const payload = await providerHelper.preparePayloadAsync(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "image-to-image"
      });
      const { url, info } = await (0, makeRequestOptions_js_1.makeRequestOptions)(args, providerHelper, { ...options, task: "image-to-image" });
      return providerHelper.getResponse(res, url, info.headers);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageToText.js
var require_imageToText = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageToText.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.imageToText = imageToText;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var utils_js_1 = require_utils2();
    async function imageToText(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "image-to-text");
      const payload = (0, utils_js_1.preparePayload)(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "image-to-text"
      });
      return providerHelper.getResponse(res[0]);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageToVideo.js
var require_imageToVideo = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageToVideo.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.imageToVideo = imageToVideo;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var makeRequestOptions_js_1 = require_makeRequestOptions();
    async function imageToVideo(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "image-to-video");
      const payload = await providerHelper.preparePayloadAsync(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "image-to-video"
      });
      const { url, info } = await (0, makeRequestOptions_js_1.makeRequestOptions)(args, providerHelper, { ...options, task: "image-to-video" });
      return providerHelper.getResponse(res, url, info.headers);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageTextToImage.js
var require_imageTextToImage = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageTextToImage.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.imageTextToImage = imageTextToImage;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function imageTextToImage(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "image-text-to-image");
      const payload = await providerHelper.preparePayloadAsync(args);
      const { data: res, requestContext } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "image-text-to-image"
      });
      return providerHelper.getResponse(res, requestContext.url, requestContext.info.headers);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageTextToVideo.js
var require_imageTextToVideo = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/imageTextToVideo.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.imageTextToVideo = imageTextToVideo;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function imageTextToVideo(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "image-text-to-video");
      const payload = await providerHelper.preparePayloadAsync(args);
      const { data: res, requestContext } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "image-text-to-video"
      });
      return providerHelper.getResponse(res, requestContext.url, requestContext.info.headers);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/objectDetection.js
var require_objectDetection = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/objectDetection.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.objectDetection = objectDetection;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var utils_js_1 = require_utils2();
    async function objectDetection(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "object-detection");
      const payload = (0, utils_js_1.preparePayload)(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "object-detection"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/textToImage.js
var require_textToImage = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/textToImage.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.textToImage = textToImage;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var makeRequestOptions_js_1 = require_makeRequestOptions();
    var request_js_1 = require_request();
    async function textToImage(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "text-to-image");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "text-to-image"
      });
      const { url, info } = await (0, makeRequestOptions_js_1.makeRequestOptions)(args, providerHelper, { ...options, task: "text-to-image" });
      return providerHelper.getResponse(res, url, info.headers, options?.outputType);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/textToVideo.js
var require_textToVideo = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/textToVideo.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.textToVideo = textToVideo;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var makeRequestOptions_js_1 = require_makeRequestOptions();
    var request_js_1 = require_request();
    async function textToVideo(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "text-to-video");
      const { data: response } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "text-to-video"
      });
      const { url, info } = await (0, makeRequestOptions_js_1.makeRequestOptions)(args, providerHelper, { ...options, task: "text-to-video" });
      return providerHelper.getResponse(response, url, info.headers);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/cv/zeroShotImageClassification.js
var require_zeroShotImageClassification = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/cv/zeroShotImageClassification.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.zeroShotImageClassification = zeroShotImageClassification;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var base64FromBytes_js_1 = require_base64FromBytes();
    var request_js_1 = require_request();
    async function preparePayload(args) {
      if (args.inputs instanceof Blob) {
        return {
          ...args,
          inputs: {
            image: (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(await args.inputs.arrayBuffer()))
          }
        };
      } else {
        return {
          ...args,
          inputs: {
            image: (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(args.inputs.image instanceof ArrayBuffer ? args.inputs.image : await args.inputs.image.arrayBuffer()))
          }
        };
      }
    }
    async function zeroShotImageClassification(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "zero-shot-image-classification");
      const payload = await preparePayload(args);
      const { data: res } = await (0, request_js_1.innerRequest)(payload, providerHelper, {
        ...options,
        task: "zero-shot-image-classification"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/chatCompletion.js
var require_chatCompletion = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/chatCompletion.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.chatCompletion = chatCompletion;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var providerHelper_js_1 = require_providerHelper();
    async function chatCompletion(args, options) {
      let providerHelper;
      if (!args.provider || args.provider === "auto") {
        providerHelper = new providerHelper_js_1.AutoRouterConversationalTask();
      } else {
        const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
        providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "conversational");
      }
      const { data: response } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "conversational"
      });
      return providerHelper.getResponse(response);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/chatCompletionStream.js
var require_chatCompletionStream = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/chatCompletionStream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.chatCompletionStream = chatCompletionStream;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    var providerHelper_js_1 = require_providerHelper();
    async function* chatCompletionStream(args, options) {
      let providerHelper;
      if (!args.provider || args.provider === "auto") {
        providerHelper = new providerHelper_js_1.AutoRouterConversationalTask();
      } else {
        const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
        providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "conversational");
      }
      yield* (0, request_js_1.innerStreamingRequest)(args, providerHelper, {
        ...options,
        task: "conversational"
      });
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/featureExtraction.js
var require_featureExtraction = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/featureExtraction.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.featureExtraction = featureExtraction;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function featureExtraction(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "feature-extraction");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "feature-extraction"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/fillMask.js
var require_fillMask = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/fillMask.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.fillMask = fillMask;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function fillMask(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "fill-mask");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "fill-mask"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/questionAnswering.js
var require_questionAnswering = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/questionAnswering.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.questionAnswering = questionAnswering;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function questionAnswering(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "question-answering");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "question-answering"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/sentenceSimilarity.js
var require_sentenceSimilarity = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/sentenceSimilarity.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.sentenceSimilarity = sentenceSimilarity;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function sentenceSimilarity(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "sentence-similarity");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "sentence-similarity"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/summarization.js
var require_summarization = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/summarization.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.summarization = summarization;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function summarization(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "summarization");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "summarization"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/tableQuestionAnswering.js
var require_tableQuestionAnswering = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/tableQuestionAnswering.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.tableQuestionAnswering = tableQuestionAnswering;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function tableQuestionAnswering(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "table-question-answering");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "table-question-answering"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/textClassification.js
var require_textClassification = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/textClassification.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.textClassification = textClassification;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function textClassification(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "text-classification");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "text-classification"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/textGeneration.js
var require_textGeneration = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/textGeneration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.textGeneration = textGeneration;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function textGeneration(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "text-generation");
      const { data: response } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "text-generation"
      });
      return providerHelper.getResponse(response);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/textGenerationStream.js
var require_textGenerationStream = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/textGenerationStream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.textGenerationStream = textGenerationStream;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function* textGenerationStream(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "text-generation");
      yield* (0, request_js_1.innerStreamingRequest)(args, providerHelper, {
        ...options,
        task: "text-generation"
      });
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/tokenClassification.js
var require_tokenClassification = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/tokenClassification.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.tokenClassification = tokenClassification;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function tokenClassification(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "token-classification");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "token-classification"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/translation.js
var require_translation = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/translation.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.translation = translation;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function translation(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "translation");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "translation"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/zeroShotClassification.js
var require_zeroShotClassification = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/nlp/zeroShotClassification.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.zeroShotClassification = zeroShotClassification;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function zeroShotClassification(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "zero-shot-classification");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "zero-shot-classification"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/multimodal/documentQuestionAnswering.js
var require_documentQuestionAnswering = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/multimodal/documentQuestionAnswering.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.documentQuestionAnswering = documentQuestionAnswering;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var base64FromBytes_js_1 = require_base64FromBytes();
    var request_js_1 = require_request();
    async function documentQuestionAnswering(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "document-question-answering");
      const reqArgs = {
        ...args,
        inputs: {
          question: args.inputs.question,
          // convert Blob or ArrayBuffer to base64
          image: (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(await args.inputs.image.arrayBuffer()))
        }
      };
      const { data: res } = await (0, request_js_1.innerRequest)(reqArgs, providerHelper, {
        ...options,
        task: "document-question-answering"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/multimodal/visualQuestionAnswering.js
var require_visualQuestionAnswering = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/multimodal/visualQuestionAnswering.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.visualQuestionAnswering = visualQuestionAnswering;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var base64FromBytes_js_1 = require_base64FromBytes();
    var request_js_1 = require_request();
    async function visualQuestionAnswering(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "visual-question-answering");
      const reqArgs = {
        ...args,
        inputs: {
          question: args.inputs.question,
          // convert Blob or ArrayBuffer to base64
          image: (0, base64FromBytes_js_1.base64FromBytes)(new Uint8Array(await args.inputs.image.arrayBuffer()))
        }
      };
      const { data: res } = await (0, request_js_1.innerRequest)(reqArgs, providerHelper, {
        ...options,
        task: "visual-question-answering"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/tabular/tabularClassification.js
var require_tabularClassification = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/tabular/tabularClassification.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.tabularClassification = tabularClassification;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function tabularClassification(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "tabular-classification");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "tabular-classification"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/tabular/tabularRegression.js
var require_tabularRegression = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/tabular/tabularRegression.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.tabularRegression = tabularRegression;
    var getInferenceProviderMapping_js_1 = require_getInferenceProviderMapping();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var request_js_1 = require_request();
    async function tabularRegression(args, options) {
      const provider = await (0, getInferenceProviderMapping_js_1.resolveProvider)(args.provider, args.model, args.endpointUrl);
      const providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, "tabular-regression");
      const { data: res } = await (0, request_js_1.innerRequest)(args, providerHelper, {
        ...options,
        task: "tabular-regression"
      });
      return providerHelper.getResponse(res);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/tasks/index.js
var require_tasks = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/tasks/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_request2(), exports2);
    __exportStar(require_streamingRequest(), exports2);
    __exportStar(require_audioClassification(), exports2);
    __exportStar(require_audioToAudio(), exports2);
    __exportStar(require_automaticSpeechRecognition(), exports2);
    __exportStar(require_textToSpeech(), exports2);
    __exportStar(require_imageClassification(), exports2);
    __exportStar(require_imageSegmentation(), exports2);
    __exportStar(require_imageToImage(), exports2);
    __exportStar(require_imageToText(), exports2);
    __exportStar(require_imageToVideo(), exports2);
    __exportStar(require_imageTextToImage(), exports2);
    __exportStar(require_imageTextToVideo(), exports2);
    __exportStar(require_objectDetection(), exports2);
    __exportStar(require_textToImage(), exports2);
    __exportStar(require_textToVideo(), exports2);
    __exportStar(require_zeroShotImageClassification(), exports2);
    __exportStar(require_chatCompletion(), exports2);
    __exportStar(require_chatCompletionStream(), exports2);
    __exportStar(require_featureExtraction(), exports2);
    __exportStar(require_fillMask(), exports2);
    __exportStar(require_questionAnswering(), exports2);
    __exportStar(require_sentenceSimilarity(), exports2);
    __exportStar(require_summarization(), exports2);
    __exportStar(require_tableQuestionAnswering(), exports2);
    __exportStar(require_textClassification(), exports2);
    __exportStar(require_textGeneration(), exports2);
    __exportStar(require_textGenerationStream(), exports2);
    __exportStar(require_tokenClassification(), exports2);
    __exportStar(require_translation(), exports2);
    __exportStar(require_zeroShotClassification(), exports2);
    __exportStar(require_documentQuestionAnswering(), exports2);
    __exportStar(require_visualQuestionAnswering(), exports2);
    __exportStar(require_tabularClassification(), exports2);
    __exportStar(require_tabularRegression(), exports2);
  }
});

// node_modules/@huggingface/inference/dist/commonjs/utils/typedEntries.js
var require_typedEntries = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/utils/typedEntries.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.typedEntries = typedEntries;
    function typedEntries(obj) {
      return Object.entries(obj);
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/InferenceClient.js
var require_InferenceClient = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/InferenceClient.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InferenceClientEndpoint = exports2.HfInference = exports2.InferenceClient = void 0;
    var tasks = __importStar(require_tasks());
    var omit_js_1 = require_omit();
    var typedEntries_js_1 = require_typedEntries();
    var InferenceClient = class _InferenceClient {
      accessToken;
      defaultOptions;
      constructor(accessToken = "", defaultOptions = {}) {
        this.accessToken = accessToken;
        this.defaultOptions = defaultOptions;
        for (const [name, fn] of (0, typedEntries_js_1.typedEntries)(tasks)) {
          Object.defineProperty(this, name, {
            enumerable: false,
            value: (params, options) => (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fn(
                /// ^ The cast of fn to any is necessary, otherwise TS can't compile because the generated union type is too complex
                { endpointUrl: defaultOptions.endpointUrl, accessToken, ...params },
                {
                  ...(0, omit_js_1.omit)(defaultOptions, ["endpointUrl"]),
                  ...options
                }
              )
            )
          });
        }
      }
      /**
       * Returns a new instance of InferenceClient tied to a specified endpoint.
       *
       * For backward compatibility mostly.
       */
      endpoint(endpointUrl) {
        return new _InferenceClient(this.accessToken, { ...this.defaultOptions, endpointUrl });
      }
    };
    exports2.InferenceClient = InferenceClient;
    var HfInference2 = class extends InferenceClient {
    };
    exports2.HfInference = HfInference2;
    var InferenceClientEndpoint = class extends InferenceClient {
    };
    exports2.InferenceClientEndpoint = InferenceClientEndpoint;
  }
});

// node_modules/@huggingface/inference/dist/commonjs/types.js
var require_types = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PROVIDERS_HUB_ORGS = exports2.PROVIDERS_OR_POLICIES = exports2.INFERENCE_PROVIDERS = void 0;
    exports2.INFERENCE_PROVIDERS = [
      "baseten",
      "black-forest-labs",
      "cerebras",
      "clarifai",
      "cohere",
      "fal-ai",
      "featherless-ai",
      "fireworks-ai",
      "groq",
      "hf-inference",
      "hyperbolic",
      "nebius",
      "novita",
      "nscale",
      "openai",
      "ovhcloud",
      "publicai",
      "replicate",
      "sambanova",
      "scaleway",
      "together",
      "wavespeed",
      "zai-org"
    ];
    exports2.PROVIDERS_OR_POLICIES = [...exports2.INFERENCE_PROVIDERS, "auto"];
    exports2.PROVIDERS_HUB_ORGS = {
      baseten: "baseten",
      "black-forest-labs": "black-forest-labs",
      cerebras: "cerebras",
      clarifai: "clarifai",
      cohere: "CohereLabs",
      "fal-ai": "fal",
      "featherless-ai": "featherless-ai",
      "fireworks-ai": "fireworks-ai",
      groq: "groq",
      "hf-inference": "hf-inference",
      hyperbolic: "Hyperbolic",
      nebius: "nebius",
      novita: "novita",
      nscale: "nscale",
      openai: "openai",
      ovhcloud: "ovhcloud",
      publicai: "publicai",
      replicate: "replicate",
      sambanova: "sambanovasystems",
      scaleway: "scaleway",
      together: "togethercomputer",
      wavespeed: "wavespeed",
      "zai-org": "zai-org"
    };
  }
});

// node_modules/@huggingface/jinja/dist/index.cjs
var require_dist = __commonJS({
  "node_modules/@huggingface/jinja/dist/index.cjs"(exports2, module2) {
    "use strict";
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      Environment: () => Environment,
      Interpreter: () => Interpreter,
      Template: () => Template,
      parse: () => parse,
      tokenize: () => tokenize
    });
    module2.exports = __toCommonJS(src_exports);
    var TOKEN_TYPES = Object.freeze({
      Text: "Text",
      // The text between Jinja statements or expressions
      NumericLiteral: "NumericLiteral",
      // e.g., 123, 1.0
      StringLiteral: "StringLiteral",
      // 'string'
      Identifier: "Identifier",
      // Variables, functions, statements, booleans, etc.
      Equals: "Equals",
      // =
      OpenParen: "OpenParen",
      // (
      CloseParen: "CloseParen",
      // )
      OpenStatement: "OpenStatement",
      // {%
      CloseStatement: "CloseStatement",
      // %}
      OpenExpression: "OpenExpression",
      // {{
      CloseExpression: "CloseExpression",
      // }}
      OpenSquareBracket: "OpenSquareBracket",
      // [
      CloseSquareBracket: "CloseSquareBracket",
      // ]
      OpenCurlyBracket: "OpenCurlyBracket",
      // {
      CloseCurlyBracket: "CloseCurlyBracket",
      // }
      Comma: "Comma",
      // ,
      Dot: "Dot",
      // .
      Colon: "Colon",
      // :
      Pipe: "Pipe",
      // |
      CallOperator: "CallOperator",
      // ()
      AdditiveBinaryOperator: "AdditiveBinaryOperator",
      // + - ~
      MultiplicativeBinaryOperator: "MultiplicativeBinaryOperator",
      // * / %
      ComparisonBinaryOperator: "ComparisonBinaryOperator",
      // < > <= >= == !=
      UnaryOperator: "UnaryOperator",
      // ! - +
      Comment: "Comment"
      // {# ... #}
    });
    var Token = class {
      /**
       * Constructs a new Token.
       * @param {string} value The raw value as seen inside the source code.
       * @param {TokenType} type The type of token.
       */
      constructor(value, type) {
        this.value = value;
        this.type = type;
      }
    };
    function isWord(char) {
      return /\w/.test(char);
    }
    function isInteger(char) {
      return /[0-9]/.test(char);
    }
    function isWhitespace(char) {
      return /\s/.test(char);
    }
    var ORDERED_MAPPING_TABLE = [
      // Control sequences
      ["{%", TOKEN_TYPES.OpenStatement],
      ["%}", TOKEN_TYPES.CloseStatement],
      ["{{", TOKEN_TYPES.OpenExpression],
      ["}}", TOKEN_TYPES.CloseExpression],
      // Single character tokens
      ["(", TOKEN_TYPES.OpenParen],
      [")", TOKEN_TYPES.CloseParen],
      ["{", TOKEN_TYPES.OpenCurlyBracket],
      ["}", TOKEN_TYPES.CloseCurlyBracket],
      ["[", TOKEN_TYPES.OpenSquareBracket],
      ["]", TOKEN_TYPES.CloseSquareBracket],
      [",", TOKEN_TYPES.Comma],
      [".", TOKEN_TYPES.Dot],
      [":", TOKEN_TYPES.Colon],
      ["|", TOKEN_TYPES.Pipe],
      // Comparison operators
      ["<=", TOKEN_TYPES.ComparisonBinaryOperator],
      [">=", TOKEN_TYPES.ComparisonBinaryOperator],
      ["==", TOKEN_TYPES.ComparisonBinaryOperator],
      ["!=", TOKEN_TYPES.ComparisonBinaryOperator],
      ["<", TOKEN_TYPES.ComparisonBinaryOperator],
      [">", TOKEN_TYPES.ComparisonBinaryOperator],
      // Arithmetic operators
      ["+", TOKEN_TYPES.AdditiveBinaryOperator],
      ["-", TOKEN_TYPES.AdditiveBinaryOperator],
      ["~", TOKEN_TYPES.AdditiveBinaryOperator],
      ["*", TOKEN_TYPES.MultiplicativeBinaryOperator],
      ["/", TOKEN_TYPES.MultiplicativeBinaryOperator],
      ["%", TOKEN_TYPES.MultiplicativeBinaryOperator],
      // Assignment operator
      ["=", TOKEN_TYPES.Equals]
    ];
    var ESCAPE_CHARACTERS = /* @__PURE__ */ new Map([
      ["n", "\n"],
      // New line
      ["t", "	"],
      // Horizontal tab
      ["r", "\r"],
      // Carriage return
      ["b", "\b"],
      // Backspace
      ["f", "\f"],
      // Form feed
      ["v", "\v"],
      // Vertical tab
      ["'", "'"],
      // Single quote
      ['"', '"'],
      // Double quote
      ["\\", "\\"]
      // Backslash
    ]);
    function preprocess(template, options = {}) {
      if (template.endsWith("\n")) {
        template = template.slice(0, -1);
      }
      if (options.lstrip_blocks) {
        template = template.replace(/^[ \t]*({[#%-])/gm, "$1");
      }
      if (options.trim_blocks) {
        template = template.replace(/([#%-]})\n/g, "$1");
      }
      return template.replace(/{%\s*(end)?generation\s*%}/gs, "");
    }
    function tokenize(source, options = {}) {
      const tokens = [];
      const src = preprocess(source, options);
      let cursorPosition = 0;
      let curlyBracketDepth = 0;
      const consumeWhile = (predicate) => {
        let str = "";
        while (predicate(src[cursorPosition])) {
          if (src[cursorPosition] === "\\") {
            ++cursorPosition;
            if (cursorPosition >= src.length)
              throw new SyntaxError("Unexpected end of input");
            const escaped = src[cursorPosition++];
            const unescaped = ESCAPE_CHARACTERS.get(escaped);
            if (unescaped === void 0) {
              throw new SyntaxError(`Unexpected escaped character: ${escaped}`);
            }
            str += unescaped;
            continue;
          }
          str += src[cursorPosition++];
          if (cursorPosition >= src.length)
            throw new SyntaxError("Unexpected end of input");
        }
        return str;
      };
      const stripTrailingWhitespace = () => {
        const lastToken = tokens.at(-1);
        if (lastToken && lastToken.type === TOKEN_TYPES.Text) {
          lastToken.value = lastToken.value.trimEnd();
          if (lastToken.value === "") {
            tokens.pop();
          }
        }
      };
      const skipLeadingWhitespace = () => {
        while (cursorPosition < src.length && isWhitespace(src[cursorPosition])) {
          ++cursorPosition;
        }
      };
      main:
        while (cursorPosition < src.length) {
          const lastTokenType = tokens.at(-1)?.type;
          if (lastTokenType === void 0 || lastTokenType === TOKEN_TYPES.CloseStatement || lastTokenType === TOKEN_TYPES.CloseExpression || lastTokenType === TOKEN_TYPES.Comment) {
            let text = "";
            while (cursorPosition < src.length && // Keep going until we hit the next Jinja statement or expression
            !(src[cursorPosition] === "{" && (src[cursorPosition + 1] === "%" || src[cursorPosition + 1] === "{" || src[cursorPosition + 1] === "#"))) {
              text += src[cursorPosition++];
            }
            if (text.length > 0) {
              tokens.push(new Token(text, TOKEN_TYPES.Text));
              continue;
            }
          }
          if (src[cursorPosition] === "{" && src[cursorPosition + 1] === "#") {
            cursorPosition += 2;
            const stripBefore = src[cursorPosition] === "-";
            if (stripBefore) {
              ++cursorPosition;
            }
            let comment = "";
            while (src[cursorPosition] !== "#" || src[cursorPosition + 1] !== "}") {
              if (cursorPosition + 2 >= src.length) {
                throw new SyntaxError("Missing end of comment tag");
              }
              comment += src[cursorPosition++];
            }
            const stripAfter = comment.endsWith("-");
            if (stripAfter) {
              comment = comment.slice(0, -1);
            }
            if (stripBefore) {
              stripTrailingWhitespace();
            }
            tokens.push(new Token(comment, TOKEN_TYPES.Comment));
            cursorPosition += 2;
            if (stripAfter) {
              skipLeadingWhitespace();
            }
            continue;
          }
          if (src.slice(cursorPosition, cursorPosition + 3) === "{%-") {
            stripTrailingWhitespace();
            tokens.push(new Token("{%", TOKEN_TYPES.OpenStatement));
            cursorPosition += 3;
            continue;
          }
          if (src.slice(cursorPosition, cursorPosition + 3) === "{{-") {
            stripTrailingWhitespace();
            tokens.push(new Token("{{", TOKEN_TYPES.OpenExpression));
            curlyBracketDepth = 0;
            cursorPosition += 3;
            continue;
          }
          consumeWhile(isWhitespace);
          if (src.slice(cursorPosition, cursorPosition + 3) === "-%}") {
            tokens.push(new Token("%}", TOKEN_TYPES.CloseStatement));
            cursorPosition += 3;
            skipLeadingWhitespace();
            continue;
          }
          if (src.slice(cursorPosition, cursorPosition + 3) === "-}}") {
            tokens.push(new Token("}}", TOKEN_TYPES.CloseExpression));
            cursorPosition += 3;
            skipLeadingWhitespace();
            continue;
          }
          const char = src[cursorPosition];
          if (char === "-" || char === "+") {
            const lastTokenType2 = tokens.at(-1)?.type;
            if (lastTokenType2 === TOKEN_TYPES.Text || lastTokenType2 === void 0) {
              throw new SyntaxError(`Unexpected character: ${char}`);
            }
            switch (lastTokenType2) {
              case TOKEN_TYPES.Identifier:
              case TOKEN_TYPES.NumericLiteral:
              case TOKEN_TYPES.StringLiteral:
              case TOKEN_TYPES.CloseParen:
              case TOKEN_TYPES.CloseSquareBracket:
                break;
              default: {
                ++cursorPosition;
                const num = consumeWhile(isInteger);
                tokens.push(
                  new Token(`${char}${num}`, num.length > 0 ? TOKEN_TYPES.NumericLiteral : TOKEN_TYPES.UnaryOperator)
                );
                continue;
              }
            }
          }
          for (const [seq, type] of ORDERED_MAPPING_TABLE) {
            if (seq === "}}" && curlyBracketDepth > 0) {
              continue;
            }
            const slice2 = src.slice(cursorPosition, cursorPosition + seq.length);
            if (slice2 === seq) {
              tokens.push(new Token(seq, type));
              if (type === TOKEN_TYPES.OpenExpression) {
                curlyBracketDepth = 0;
              } else if (type === TOKEN_TYPES.OpenCurlyBracket) {
                ++curlyBracketDepth;
              } else if (type === TOKEN_TYPES.CloseCurlyBracket) {
                --curlyBracketDepth;
              }
              cursorPosition += seq.length;
              continue main;
            }
          }
          if (char === "'" || char === '"') {
            ++cursorPosition;
            const str = consumeWhile((c) => c !== char);
            tokens.push(new Token(str, TOKEN_TYPES.StringLiteral));
            ++cursorPosition;
            continue;
          }
          if (isInteger(char)) {
            let num = consumeWhile(isInteger);
            if (src[cursorPosition] === "." && isInteger(src[cursorPosition + 1])) {
              ++cursorPosition;
              const frac = consumeWhile(isInteger);
              num = `${num}.${frac}`;
            }
            tokens.push(new Token(num, TOKEN_TYPES.NumericLiteral));
            continue;
          }
          if (isWord(char)) {
            const word = consumeWhile(isWord);
            tokens.push(new Token(word, TOKEN_TYPES.Identifier));
            continue;
          }
          throw new SyntaxError(`Unexpected character: ${char}`);
        }
      return tokens;
    }
    var Statement = class {
      type = "Statement";
    };
    var Program = class extends Statement {
      constructor(body) {
        super();
        this.body = body;
      }
      type = "Program";
    };
    var If = class extends Statement {
      constructor(test, body, alternate) {
        super();
        this.test = test;
        this.body = body;
        this.alternate = alternate;
      }
      type = "If";
    };
    var For = class extends Statement {
      constructor(loopvar, iterable, body, defaultBlock) {
        super();
        this.loopvar = loopvar;
        this.iterable = iterable;
        this.body = body;
        this.defaultBlock = defaultBlock;
      }
      type = "For";
    };
    var Break = class extends Statement {
      type = "Break";
    };
    var Continue = class extends Statement {
      type = "Continue";
    };
    var SetStatement = class extends Statement {
      constructor(assignee, value, body) {
        super();
        this.assignee = assignee;
        this.value = value;
        this.body = body;
      }
      type = "Set";
    };
    var Macro = class extends Statement {
      constructor(name, args, body) {
        super();
        this.name = name;
        this.args = args;
        this.body = body;
      }
      type = "Macro";
    };
    var Comment = class extends Statement {
      constructor(value) {
        super();
        this.value = value;
      }
      type = "Comment";
    };
    var Expression = class extends Statement {
      type = "Expression";
    };
    var MemberExpression = class extends Expression {
      constructor(object, property, computed) {
        super();
        this.object = object;
        this.property = property;
        this.computed = computed;
      }
      type = "MemberExpression";
    };
    var CallExpression = class extends Expression {
      constructor(callee, args) {
        super();
        this.callee = callee;
        this.args = args;
      }
      type = "CallExpression";
    };
    var Identifier = class extends Expression {
      /**
       * @param {string} value The name of the identifier
       */
      constructor(value) {
        super();
        this.value = value;
      }
      type = "Identifier";
    };
    var Literal = class extends Expression {
      constructor(value) {
        super();
        this.value = value;
      }
      type = "Literal";
    };
    var IntegerLiteral = class extends Literal {
      type = "IntegerLiteral";
    };
    var FloatLiteral = class extends Literal {
      type = "FloatLiteral";
    };
    var StringLiteral = class extends Literal {
      type = "StringLiteral";
    };
    var ArrayLiteral = class extends Literal {
      type = "ArrayLiteral";
    };
    var TupleLiteral = class extends Literal {
      type = "TupleLiteral";
    };
    var ObjectLiteral = class extends Literal {
      type = "ObjectLiteral";
    };
    var BinaryExpression = class extends Expression {
      constructor(operator, left, right) {
        super();
        this.operator = operator;
        this.left = left;
        this.right = right;
      }
      type = "BinaryExpression";
    };
    var FilterExpression = class extends Expression {
      constructor(operand, filter) {
        super();
        this.operand = operand;
        this.filter = filter;
      }
      type = "FilterExpression";
    };
    var FilterStatement = class extends Statement {
      constructor(filter, body) {
        super();
        this.filter = filter;
        this.body = body;
      }
      type = "FilterStatement";
    };
    var SelectExpression = class extends Expression {
      constructor(lhs, test) {
        super();
        this.lhs = lhs;
        this.test = test;
      }
      type = "SelectExpression";
    };
    var TestExpression = class extends Expression {
      constructor(operand, negate, test) {
        super();
        this.operand = operand;
        this.negate = negate;
        this.test = test;
      }
      type = "TestExpression";
    };
    var UnaryExpression = class extends Expression {
      constructor(operator, argument) {
        super();
        this.operator = operator;
        this.argument = argument;
      }
      type = "UnaryExpression";
    };
    var SliceExpression = class extends Expression {
      constructor(start = void 0, stop = void 0, step = void 0) {
        super();
        this.start = start;
        this.stop = stop;
        this.step = step;
      }
      type = "SliceExpression";
    };
    var KeywordArgumentExpression = class extends Expression {
      constructor(key, value) {
        super();
        this.key = key;
        this.value = value;
      }
      type = "KeywordArgumentExpression";
    };
    var SpreadExpression = class extends Expression {
      constructor(argument) {
        super();
        this.argument = argument;
      }
      type = "SpreadExpression";
    };
    var CallStatement = class extends Statement {
      constructor(call, callerArgs, body) {
        super();
        this.call = call;
        this.callerArgs = callerArgs;
        this.body = body;
      }
      type = "CallStatement";
    };
    var Ternary = class extends Expression {
      constructor(condition, trueExpr, falseExpr) {
        super();
        this.condition = condition;
        this.trueExpr = trueExpr;
        this.falseExpr = falseExpr;
      }
      type = "Ternary";
    };
    function parse(tokens) {
      const program = new Program([]);
      let current = 0;
      function expect(type, error) {
        const prev = tokens[current++];
        if (!prev || prev.type !== type) {
          throw new Error(`Parser Error: ${error}. ${prev.type} !== ${type}.`);
        }
        return prev;
      }
      function expectIdentifier(name) {
        if (!isIdentifier(name)) {
          throw new SyntaxError(`Expected ${name}`);
        }
        ++current;
      }
      function parseAny() {
        switch (tokens[current].type) {
          case TOKEN_TYPES.Comment:
            return new Comment(tokens[current++].value);
          case TOKEN_TYPES.Text:
            return parseText();
          case TOKEN_TYPES.OpenStatement:
            return parseJinjaStatement();
          case TOKEN_TYPES.OpenExpression:
            return parseJinjaExpression();
          default:
            throw new SyntaxError(`Unexpected token type: ${tokens[current].type}`);
        }
      }
      function is(...types) {
        return current + types.length <= tokens.length && types.every((type, i) => type === tokens[current + i].type);
      }
      function isStatement(...names) {
        return tokens[current]?.type === TOKEN_TYPES.OpenStatement && tokens[current + 1]?.type === TOKEN_TYPES.Identifier && names.includes(tokens[current + 1]?.value);
      }
      function isIdentifier(...names) {
        return current + names.length <= tokens.length && names.every((name, i) => tokens[current + i].type === "Identifier" && name === tokens[current + i].value);
      }
      function parseText() {
        return new StringLiteral(expect(TOKEN_TYPES.Text, "Expected text token").value);
      }
      function parseJinjaStatement() {
        expect(TOKEN_TYPES.OpenStatement, "Expected opening statement token");
        if (tokens[current].type !== TOKEN_TYPES.Identifier) {
          throw new SyntaxError(`Unknown statement, got ${tokens[current].type}`);
        }
        const name = tokens[current].value;
        let result;
        switch (name) {
          case "set":
            ++current;
            result = parseSetStatement();
            break;
          case "if":
            ++current;
            result = parseIfStatement();
            expect(TOKEN_TYPES.OpenStatement, "Expected {% token");
            expectIdentifier("endif");
            expect(TOKEN_TYPES.CloseStatement, "Expected %} token");
            break;
          case "macro":
            ++current;
            result = parseMacroStatement();
            expect(TOKEN_TYPES.OpenStatement, "Expected {% token");
            expectIdentifier("endmacro");
            expect(TOKEN_TYPES.CloseStatement, "Expected %} token");
            break;
          case "for":
            ++current;
            result = parseForStatement();
            expect(TOKEN_TYPES.OpenStatement, "Expected {% token");
            expectIdentifier("endfor");
            expect(TOKEN_TYPES.CloseStatement, "Expected %} token");
            break;
          case "call": {
            ++current;
            let callerArgs = null;
            if (is(TOKEN_TYPES.OpenParen)) {
              callerArgs = parseArgs();
            }
            const callee = parsePrimaryExpression();
            if (callee.type !== "Identifier") {
              throw new SyntaxError(`Expected identifier following call statement`);
            }
            const callArgs = parseArgs();
            expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
            const body = [];
            while (!isStatement("endcall")) {
              body.push(parseAny());
            }
            expect(TOKEN_TYPES.OpenStatement, "Expected '{%'");
            expectIdentifier("endcall");
            expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
            const callExpr = new CallExpression(callee, callArgs);
            result = new CallStatement(callExpr, callerArgs, body);
            break;
          }
          case "break":
            ++current;
            expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
            result = new Break();
            break;
          case "continue":
            ++current;
            expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
            result = new Continue();
            break;
          case "filter": {
            ++current;
            let filterNode = parsePrimaryExpression();
            if (filterNode instanceof Identifier && is(TOKEN_TYPES.OpenParen)) {
              filterNode = parseCallExpression(filterNode);
            }
            expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
            const filterBody = [];
            while (!isStatement("endfilter")) {
              filterBody.push(parseAny());
            }
            expect(TOKEN_TYPES.OpenStatement, "Expected '{%'");
            expectIdentifier("endfilter");
            expect(TOKEN_TYPES.CloseStatement, "Expected '%}'");
            result = new FilterStatement(filterNode, filterBody);
            break;
          }
          default:
            throw new SyntaxError(`Unknown statement type: ${name}`);
        }
        return result;
      }
      function parseJinjaExpression() {
        expect(TOKEN_TYPES.OpenExpression, "Expected opening expression token");
        const result = parseExpression();
        expect(TOKEN_TYPES.CloseExpression, "Expected closing expression token");
        return result;
      }
      function parseSetStatement() {
        const left = parseExpressionSequence();
        let value = null;
        const body = [];
        if (is(TOKEN_TYPES.Equals)) {
          ++current;
          value = parseExpressionSequence();
        } else {
          expect(TOKEN_TYPES.CloseStatement, "Expected %} token");
          while (!isStatement("endset")) {
            body.push(parseAny());
          }
          expect(TOKEN_TYPES.OpenStatement, "Expected {% token");
          expectIdentifier("endset");
        }
        expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
        return new SetStatement(left, value, body);
      }
      function parseIfStatement() {
        const test = parseExpression();
        expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
        const body = [];
        const alternate = [];
        while (!isStatement("elif", "else", "endif")) {
          body.push(parseAny());
        }
        if (isStatement("elif")) {
          ++current;
          ++current;
          const result = parseIfStatement();
          alternate.push(result);
        } else if (isStatement("else")) {
          ++current;
          ++current;
          expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
          while (!isStatement("endif")) {
            alternate.push(parseAny());
          }
        }
        return new If(test, body, alternate);
      }
      function parseMacroStatement() {
        const name = parsePrimaryExpression();
        if (name.type !== "Identifier") {
          throw new SyntaxError(`Expected identifier following macro statement`);
        }
        const args = parseArgs();
        expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
        const body = [];
        while (!isStatement("endmacro")) {
          body.push(parseAny());
        }
        return new Macro(name, args, body);
      }
      function parseExpressionSequence(primary = false) {
        const fn = primary ? parsePrimaryExpression : parseExpression;
        const expressions = [fn()];
        const isTuple = is(TOKEN_TYPES.Comma);
        while (isTuple) {
          ++current;
          expressions.push(fn());
          if (!is(TOKEN_TYPES.Comma)) {
            break;
          }
        }
        return isTuple ? new TupleLiteral(expressions) : expressions[0];
      }
      function parseForStatement() {
        const loopVariable = parseExpressionSequence(true);
        if (!(loopVariable instanceof Identifier || loopVariable instanceof TupleLiteral)) {
          throw new SyntaxError(`Expected identifier/tuple for the loop variable, got ${loopVariable.type} instead`);
        }
        if (!isIdentifier("in")) {
          throw new SyntaxError("Expected `in` keyword following loop variable");
        }
        ++current;
        const iterable = parseExpression();
        expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
        const body = [];
        while (!isStatement("endfor", "else")) {
          body.push(parseAny());
        }
        const alternative = [];
        if (isStatement("else")) {
          ++current;
          ++current;
          expect(TOKEN_TYPES.CloseStatement, "Expected closing statement token");
          while (!isStatement("endfor")) {
            alternative.push(parseAny());
          }
        }
        return new For(loopVariable, iterable, body, alternative);
      }
      function parseExpression() {
        return parseIfExpression();
      }
      function parseIfExpression() {
        const a = parseLogicalOrExpression();
        if (isIdentifier("if")) {
          ++current;
          const test = parseLogicalOrExpression();
          if (isIdentifier("else")) {
            ++current;
            const falseExpr = parseIfExpression();
            return new Ternary(test, a, falseExpr);
          } else {
            return new SelectExpression(a, test);
          }
        }
        return a;
      }
      function parseLogicalOrExpression() {
        let left = parseLogicalAndExpression();
        while (isIdentifier("or")) {
          const operator = tokens[current];
          ++current;
          const right = parseLogicalAndExpression();
          left = new BinaryExpression(operator, left, right);
        }
        return left;
      }
      function parseLogicalAndExpression() {
        let left = parseLogicalNegationExpression();
        while (isIdentifier("and")) {
          const operator = tokens[current];
          ++current;
          const right = parseLogicalNegationExpression();
          left = new BinaryExpression(operator, left, right);
        }
        return left;
      }
      function parseLogicalNegationExpression() {
        let right;
        while (isIdentifier("not")) {
          const operator = tokens[current];
          ++current;
          const arg = parseLogicalNegationExpression();
          right = new UnaryExpression(operator, arg);
        }
        return right ?? parseComparisonExpression();
      }
      function parseComparisonExpression() {
        let left = parseAdditiveExpression();
        while (true) {
          let operator;
          if (isIdentifier("not", "in")) {
            operator = new Token("not in", TOKEN_TYPES.Identifier);
            current += 2;
          } else if (isIdentifier("in")) {
            operator = tokens[current++];
          } else if (is(TOKEN_TYPES.ComparisonBinaryOperator)) {
            operator = tokens[current++];
          } else {
            break;
          }
          const right = parseAdditiveExpression();
          left = new BinaryExpression(operator, left, right);
        }
        return left;
      }
      function parseAdditiveExpression() {
        let left = parseMultiplicativeExpression();
        while (is(TOKEN_TYPES.AdditiveBinaryOperator)) {
          const operator = tokens[current];
          ++current;
          const right = parseMultiplicativeExpression();
          left = new BinaryExpression(operator, left, right);
        }
        return left;
      }
      function parseCallMemberExpression() {
        const member = parseMemberExpression(parsePrimaryExpression());
        if (is(TOKEN_TYPES.OpenParen)) {
          return parseCallExpression(member);
        }
        return member;
      }
      function parseCallExpression(callee) {
        let expression = new CallExpression(callee, parseArgs());
        expression = parseMemberExpression(expression);
        if (is(TOKEN_TYPES.OpenParen)) {
          expression = parseCallExpression(expression);
        }
        return expression;
      }
      function parseArgs() {
        expect(TOKEN_TYPES.OpenParen, "Expected opening parenthesis for arguments list");
        const args = parseArgumentsList();
        expect(TOKEN_TYPES.CloseParen, "Expected closing parenthesis for arguments list");
        return args;
      }
      function parseArgumentsList() {
        const args = [];
        while (!is(TOKEN_TYPES.CloseParen)) {
          let argument;
          if (tokens[current].type === TOKEN_TYPES.MultiplicativeBinaryOperator && tokens[current].value === "*") {
            ++current;
            const expr = parseExpression();
            argument = new SpreadExpression(expr);
          } else {
            argument = parseExpression();
            if (is(TOKEN_TYPES.Equals)) {
              ++current;
              if (!(argument instanceof Identifier)) {
                throw new SyntaxError(`Expected identifier for keyword argument`);
              }
              const value = parseExpression();
              argument = new KeywordArgumentExpression(argument, value);
            }
          }
          args.push(argument);
          if (is(TOKEN_TYPES.Comma)) {
            ++current;
          }
        }
        return args;
      }
      function parseMemberExpressionArgumentsList() {
        const slices = [];
        let isSlice = false;
        while (!is(TOKEN_TYPES.CloseSquareBracket)) {
          if (is(TOKEN_TYPES.Colon)) {
            slices.push(void 0);
            ++current;
            isSlice = true;
          } else {
            slices.push(parseExpression());
            if (is(TOKEN_TYPES.Colon)) {
              ++current;
              isSlice = true;
            }
          }
        }
        if (slices.length === 0) {
          throw new SyntaxError(`Expected at least one argument for member/slice expression`);
        }
        if (isSlice) {
          if (slices.length > 3) {
            throw new SyntaxError(`Expected 0-3 arguments for slice expression`);
          }
          return new SliceExpression(...slices);
        }
        return slices[0];
      }
      function parseMemberExpression(object) {
        while (is(TOKEN_TYPES.Dot) || is(TOKEN_TYPES.OpenSquareBracket)) {
          const operator = tokens[current];
          ++current;
          let property;
          const computed = operator.type === TOKEN_TYPES.OpenSquareBracket;
          if (computed) {
            property = parseMemberExpressionArgumentsList();
            expect(TOKEN_TYPES.CloseSquareBracket, "Expected closing square bracket");
          } else {
            property = parsePrimaryExpression();
            if (property.type !== "Identifier") {
              throw new SyntaxError(`Expected identifier following dot operator`);
            }
          }
          object = new MemberExpression(object, property, computed);
        }
        return object;
      }
      function parseMultiplicativeExpression() {
        let left = parseTestExpression();
        while (is(TOKEN_TYPES.MultiplicativeBinaryOperator)) {
          const operator = tokens[current++];
          const right = parseTestExpression();
          left = new BinaryExpression(operator, left, right);
        }
        return left;
      }
      function parseTestExpression() {
        let operand = parseFilterExpression();
        while (isIdentifier("is")) {
          ++current;
          const negate = isIdentifier("not");
          if (negate) {
            ++current;
          }
          const filter = parsePrimaryExpression();
          if (!(filter instanceof Identifier)) {
            throw new SyntaxError(`Expected identifier for the test`);
          }
          operand = new TestExpression(operand, negate, filter);
        }
        return operand;
      }
      function parseFilterExpression() {
        let operand = parseCallMemberExpression();
        while (is(TOKEN_TYPES.Pipe)) {
          ++current;
          let filter = parsePrimaryExpression();
          if (!(filter instanceof Identifier)) {
            throw new SyntaxError(`Expected identifier for the filter`);
          }
          if (is(TOKEN_TYPES.OpenParen)) {
            filter = parseCallExpression(filter);
          }
          operand = new FilterExpression(operand, filter);
        }
        return operand;
      }
      function parsePrimaryExpression() {
        const token = tokens[current++];
        switch (token.type) {
          case TOKEN_TYPES.NumericLiteral: {
            const num = token.value;
            return num.includes(".") ? new FloatLiteral(Number(num)) : new IntegerLiteral(Number(num));
          }
          case TOKEN_TYPES.StringLiteral: {
            let value = token.value;
            while (is(TOKEN_TYPES.StringLiteral)) {
              value += tokens[current++].value;
            }
            return new StringLiteral(value);
          }
          case TOKEN_TYPES.Identifier:
            return new Identifier(token.value);
          case TOKEN_TYPES.OpenParen: {
            const expression = parseExpressionSequence();
            expect(TOKEN_TYPES.CloseParen, "Expected closing parenthesis, got ${tokens[current].type} instead.");
            return expression;
          }
          case TOKEN_TYPES.OpenSquareBracket: {
            const values = [];
            while (!is(TOKEN_TYPES.CloseSquareBracket)) {
              values.push(parseExpression());
              if (is(TOKEN_TYPES.Comma)) {
                ++current;
              }
            }
            ++current;
            return new ArrayLiteral(values);
          }
          case TOKEN_TYPES.OpenCurlyBracket: {
            const values = /* @__PURE__ */ new Map();
            while (!is(TOKEN_TYPES.CloseCurlyBracket)) {
              const key = parseExpression();
              expect(TOKEN_TYPES.Colon, "Expected colon between key and value in object literal");
              const value = parseExpression();
              values.set(key, value);
              if (is(TOKEN_TYPES.Comma)) {
                ++current;
              }
            }
            ++current;
            return new ObjectLiteral(values);
          }
          default:
            throw new SyntaxError(`Unexpected token: ${token.type}`);
        }
      }
      while (current < tokens.length) {
        program.body.push(parseAny());
      }
      return program;
    }
    function range(start, stop, step = 1) {
      if (stop === void 0) {
        stop = start;
        start = 0;
      }
      const result = [];
      for (let i = start; i < stop; i += step) {
        result.push(i);
      }
      return result;
    }
    function slice(array, start, stop, step = 1) {
      const direction = Math.sign(step);
      if (direction >= 0) {
        start = (start ??= 0) < 0 ? Math.max(array.length + start, 0) : Math.min(start, array.length);
        stop = (stop ??= array.length) < 0 ? Math.max(array.length + stop, 0) : Math.min(stop, array.length);
      } else {
        start = (start ??= array.length - 1) < 0 ? Math.max(array.length + start, -1) : Math.min(start, array.length - 1);
        stop = (stop ??= -1) < -1 ? Math.max(array.length + stop, -1) : Math.min(stop, array.length - 1);
      }
      const result = [];
      for (let i = start; direction * i < direction * stop; i += step) {
        result.push(array[i]);
      }
      return result;
    }
    function titleCase(value) {
      return value.replace(/\b\w/g, (c) => c.toUpperCase());
    }
    function strftime_now(format2) {
      return strftime(/* @__PURE__ */ new Date(), format2);
    }
    function strftime(date, format2) {
      const monthFormatterLong = new Intl.DateTimeFormat(void 0, { month: "long" });
      const monthFormatterShort = new Intl.DateTimeFormat(void 0, { month: "short" });
      const pad2 = (n) => n < 10 ? "0" + n : n.toString();
      return format2.replace(/%[YmdbBHM%]/g, (token) => {
        switch (token) {
          case "%Y":
            return date.getFullYear().toString();
          case "%m":
            return pad2(date.getMonth() + 1);
          case "%d":
            return pad2(date.getDate());
          case "%b":
            return monthFormatterShort.format(date);
          case "%B":
            return monthFormatterLong.format(date);
          case "%H":
            return pad2(date.getHours());
          case "%M":
            return pad2(date.getMinutes());
          case "%%":
            return "%";
          default:
            return token;
        }
      });
    }
    function escapeRegExp(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function replace(str, oldvalue, newvalue, count) {
      if (count === 0)
        return str;
      let remaining = count == null || count < 0 ? Infinity : count;
      const pattern = oldvalue.length === 0 ? new RegExp("(?=)", "gu") : new RegExp(escapeRegExp(oldvalue), "gu");
      return str.replaceAll(pattern, (match) => {
        if (remaining > 0) {
          --remaining;
          return newvalue;
        }
        return match;
      });
    }
    var BreakControl = class extends Error {
    };
    var ContinueControl = class extends Error {
    };
    var RuntimeValue = class {
      type = "RuntimeValue";
      value;
      /**
       * A collection of built-in functions for this type.
       */
      builtins = /* @__PURE__ */ new Map();
      /**
       * Creates a new RuntimeValue.
       */
      constructor(value = void 0) {
        this.value = value;
      }
      /**
       * Determines truthiness or falsiness of the runtime value.
       * This function should be overridden by subclasses if it has custom truthiness criteria.
       * @returns {BooleanValue} BooleanValue(true) if the value is truthy, BooleanValue(false) otherwise.
       */
      __bool__() {
        return new BooleanValue(!!this.value);
      }
      toString() {
        return String(this.value);
      }
    };
    var IntegerValue = class extends RuntimeValue {
      type = "IntegerValue";
    };
    var FloatValue = class extends RuntimeValue {
      type = "FloatValue";
      toString() {
        return this.value % 1 === 0 ? this.value.toFixed(1) : this.value.toString();
      }
    };
    var StringValue = class extends RuntimeValue {
      type = "StringValue";
      builtins = /* @__PURE__ */ new Map([
        [
          "upper",
          new FunctionValue(() => {
            return new StringValue(this.value.toUpperCase());
          })
        ],
        [
          "lower",
          new FunctionValue(() => {
            return new StringValue(this.value.toLowerCase());
          })
        ],
        [
          "strip",
          new FunctionValue(() => {
            return new StringValue(this.value.trim());
          })
        ],
        [
          "title",
          new FunctionValue(() => {
            return new StringValue(titleCase(this.value));
          })
        ],
        [
          "capitalize",
          new FunctionValue(() => {
            return new StringValue(this.value.charAt(0).toUpperCase() + this.value.slice(1));
          })
        ],
        ["length", new IntegerValue(this.value.length)],
        [
          "rstrip",
          new FunctionValue(() => {
            return new StringValue(this.value.trimEnd());
          })
        ],
        [
          "lstrip",
          new FunctionValue(() => {
            return new StringValue(this.value.trimStart());
          })
        ],
        [
          "startswith",
          new FunctionValue((args) => {
            if (args.length === 0) {
              throw new Error("startswith() requires at least one argument");
            }
            const pattern = args[0];
            if (pattern instanceof StringValue) {
              return new BooleanValue(this.value.startsWith(pattern.value));
            } else if (pattern instanceof ArrayValue) {
              for (const item of pattern.value) {
                if (!(item instanceof StringValue)) {
                  throw new Error("startswith() tuple elements must be strings");
                }
                if (this.value.startsWith(item.value)) {
                  return new BooleanValue(true);
                }
              }
              return new BooleanValue(false);
            }
            throw new Error("startswith() argument must be a string or tuple of strings");
          })
        ],
        [
          "endswith",
          new FunctionValue((args) => {
            if (args.length === 0) {
              throw new Error("endswith() requires at least one argument");
            }
            const pattern = args[0];
            if (pattern instanceof StringValue) {
              return new BooleanValue(this.value.endsWith(pattern.value));
            } else if (pattern instanceof ArrayValue) {
              for (const item of pattern.value) {
                if (!(item instanceof StringValue)) {
                  throw new Error("endswith() tuple elements must be strings");
                }
                if (this.value.endsWith(item.value)) {
                  return new BooleanValue(true);
                }
              }
              return new BooleanValue(false);
            }
            throw new Error("endswith() argument must be a string or tuple of strings");
          })
        ],
        [
          "split",
          // follows Python's `str.split(sep=None, maxsplit=-1)` function behavior
          // https://docs.python.org/3.13/library/stdtypes.html#str.split
          new FunctionValue((args) => {
            const sep = args[0] ?? new NullValue();
            if (!(sep instanceof StringValue || sep instanceof NullValue)) {
              throw new Error("sep argument must be a string or null");
            }
            const maxsplit = args[1] ?? new IntegerValue(-1);
            if (!(maxsplit instanceof IntegerValue)) {
              throw new Error("maxsplit argument must be a number");
            }
            let result = [];
            if (sep instanceof NullValue) {
              const text = this.value.trimStart();
              for (const { 0: match, index } of text.matchAll(/\S+/g)) {
                if (maxsplit.value !== -1 && result.length >= maxsplit.value && index !== void 0) {
                  result.push(match + text.slice(index + match.length));
                  break;
                }
                result.push(match);
              }
            } else {
              if (sep.value === "") {
                throw new Error("empty separator");
              }
              result = this.value.split(sep.value);
              if (maxsplit.value !== -1 && result.length > maxsplit.value) {
                result.push(result.splice(maxsplit.value).join(sep.value));
              }
            }
            return new ArrayValue(result.map((part) => new StringValue(part)));
          })
        ],
        [
          "replace",
          new FunctionValue((args) => {
            if (args.length < 2) {
              throw new Error("replace() requires at least two arguments");
            }
            const oldValue = args[0];
            const newValue = args[1];
            if (!(oldValue instanceof StringValue && newValue instanceof StringValue)) {
              throw new Error("replace() arguments must be strings");
            }
            let count;
            if (args.length > 2) {
              if (args[2].type === "KeywordArgumentsValue") {
                count = args[2].value.get("count") ?? new NullValue();
              } else {
                count = args[2];
              }
            } else {
              count = new NullValue();
            }
            if (!(count instanceof IntegerValue || count instanceof NullValue)) {
              throw new Error("replace() count argument must be a number or null");
            }
            return new StringValue(replace(this.value, oldValue.value, newValue.value, count.value));
          })
        ]
      ]);
    };
    var BooleanValue = class extends RuntimeValue {
      type = "BooleanValue";
    };
    function toJSON(input, indent, depth, convertUndefinedToNull = true) {
      const currentDepth = depth ?? 0;
      switch (input.type) {
        case "NullValue":
          return "null";
        case "UndefinedValue":
          return convertUndefinedToNull ? "null" : "undefined";
        case "IntegerValue":
        case "FloatValue":
        case "StringValue":
        case "BooleanValue":
          return JSON.stringify(input.value);
        case "ArrayValue":
        case "ObjectValue": {
          const indentValue = indent ? " ".repeat(indent) : "";
          const basePadding = "\n" + indentValue.repeat(currentDepth);
          const childrenPadding = basePadding + indentValue;
          if (input.type === "ArrayValue") {
            const core = input.value.map(
              (x) => toJSON(x, indent, currentDepth + 1, convertUndefinedToNull)
            );
            return indent ? `[${childrenPadding}${core.join(`,${childrenPadding}`)}${basePadding}]` : `[${core.join(", ")}]`;
          } else {
            const core = Array.from(input.value.entries()).map(([key, value]) => {
              const v = `"${key}": ${toJSON(value, indent, currentDepth + 1, convertUndefinedToNull)}`;
              return indent ? `${childrenPadding}${v}` : v;
            });
            return indent ? `{${core.join(",")}${basePadding}}` : `{${core.join(", ")}}`;
          }
        }
        default:
          throw new Error(`Cannot convert to JSON: ${input.type}`);
      }
    }
    var ObjectValue = class extends RuntimeValue {
      type = "ObjectValue";
      /**
       * NOTE: necessary to override since all JavaScript arrays are considered truthy,
       * while only non-empty Python arrays are consider truthy.
       *
       * e.g.,
       *  - JavaScript:  {} && 5 -> 5
       *  - Python:      {} and 5 -> {}
       */
      __bool__() {
        return new BooleanValue(this.value.size > 0);
      }
      builtins = /* @__PURE__ */ new Map([
        [
          "get",
          new FunctionValue(([key, defaultValue]) => {
            if (!(key instanceof StringValue)) {
              throw new Error(`Object key must be a string: got ${key.type}`);
            }
            return this.value.get(key.value) ?? defaultValue ?? new NullValue();
          })
        ],
        ["items", new FunctionValue(() => this.items())],
        ["keys", new FunctionValue(() => this.keys())],
        ["values", new FunctionValue(() => this.values())],
        [
          "dictsort",
          new FunctionValue((args) => {
            let kwargs = /* @__PURE__ */ new Map();
            const positionalArgs = args.filter((arg) => {
              if (arg instanceof KeywordArgumentsValue) {
                kwargs = arg.value;
                return false;
              }
              return true;
            });
            const caseSensitive = positionalArgs.at(0) ?? kwargs.get("case_sensitive") ?? new BooleanValue(false);
            if (!(caseSensitive instanceof BooleanValue)) {
              throw new Error("case_sensitive must be a boolean");
            }
            const by = positionalArgs.at(1) ?? kwargs.get("by") ?? new StringValue("key");
            if (!(by instanceof StringValue)) {
              throw new Error("by must be a string");
            }
            if (!["key", "value"].includes(by.value)) {
              throw new Error("by must be either 'key' or 'value'");
            }
            const reverse = positionalArgs.at(2) ?? kwargs.get("reverse") ?? new BooleanValue(false);
            if (!(reverse instanceof BooleanValue)) {
              throw new Error("reverse must be a boolean");
            }
            const items = Array.from(this.value.entries()).map(([key, value]) => new ArrayValue([new StringValue(key), value])).sort((a, b) => {
              const index = by.value === "key" ? 0 : 1;
              const aVal = a.value[index];
              const bVal = b.value[index];
              const result = compareRuntimeValues(aVal, bVal, caseSensitive.value);
              return reverse.value ? -result : result;
            });
            return new ArrayValue(items);
          })
        ]
      ]);
      items() {
        return new ArrayValue(
          Array.from(this.value.entries()).map(([key, value]) => new ArrayValue([new StringValue(key), value]))
        );
      }
      keys() {
        return new ArrayValue(Array.from(this.value.keys()).map((key) => new StringValue(key)));
      }
      values() {
        return new ArrayValue(Array.from(this.value.values()));
      }
      toString() {
        return toJSON(this, null, 0, false);
      }
    };
    var KeywordArgumentsValue = class extends ObjectValue {
      type = "KeywordArgumentsValue";
    };
    var ArrayValue = class extends RuntimeValue {
      type = "ArrayValue";
      builtins = /* @__PURE__ */ new Map([["length", new IntegerValue(this.value.length)]]);
      /**
       * NOTE: necessary to override since all JavaScript arrays are considered truthy,
       * while only non-empty Python arrays are consider truthy.
       *
       * e.g.,
       *  - JavaScript:  [] && 5 -> 5
       *  - Python:      [] and 5 -> []
       */
      __bool__() {
        return new BooleanValue(this.value.length > 0);
      }
      toString() {
        return toJSON(this, null, 0, false);
      }
    };
    var TupleValue = class extends ArrayValue {
      type = "TupleValue";
    };
    var FunctionValue = class extends RuntimeValue {
      type = "FunctionValue";
    };
    var NullValue = class extends RuntimeValue {
      type = "NullValue";
    };
    var UndefinedValue = class extends RuntimeValue {
      type = "UndefinedValue";
    };
    var Environment = class {
      constructor(parent) {
        this.parent = parent;
      }
      /**
       * The variables declared in this environment.
       */
      variables = /* @__PURE__ */ new Map([
        [
          "namespace",
          new FunctionValue((args) => {
            if (args.length === 0) {
              return new ObjectValue(/* @__PURE__ */ new Map());
            }
            if (args.length !== 1 || !(args[0] instanceof ObjectValue)) {
              throw new Error("`namespace` expects either zero arguments or a single object argument");
            }
            return args[0];
          })
        ]
      ]);
      /**
       * The tests available in this environment.
       */
      tests = /* @__PURE__ */ new Map([
        ["boolean", (operand) => operand.type === "BooleanValue"],
        ["callable", (operand) => operand instanceof FunctionValue],
        [
          "odd",
          (operand) => {
            if (!(operand instanceof IntegerValue)) {
              throw new Error(`cannot odd on ${operand.type}`);
            }
            return operand.value % 2 !== 0;
          }
        ],
        [
          "even",
          (operand) => {
            if (!(operand instanceof IntegerValue)) {
              throw new Error(`cannot even on ${operand.type}`);
            }
            return operand.value % 2 === 0;
          }
        ],
        ["false", (operand) => operand.type === "BooleanValue" && !operand.value],
        ["true", (operand) => operand.type === "BooleanValue" && operand.value],
        ["none", (operand) => operand.type === "NullValue"],
        ["string", (operand) => operand.type === "StringValue"],
        ["number", (operand) => operand instanceof IntegerValue || operand instanceof FloatValue],
        ["integer", (operand) => operand instanceof IntegerValue],
        ["iterable", (operand) => operand.type === "ArrayValue" || operand.type === "StringValue"],
        ["mapping", (operand) => operand.type === "ObjectValue"],
        [
          "lower",
          (operand) => {
            const str = operand.value;
            return operand.type === "StringValue" && str === str.toLowerCase();
          }
        ],
        [
          "upper",
          (operand) => {
            const str = operand.value;
            return operand.type === "StringValue" && str === str.toUpperCase();
          }
        ],
        ["none", (operand) => operand.type === "NullValue"],
        ["defined", (operand) => operand.type !== "UndefinedValue"],
        ["undefined", (operand) => operand.type === "UndefinedValue"],
        ["equalto", (a, b) => a.value === b.value],
        ["eq", (a, b) => a.value === b.value]
      ]);
      /**
       * Set the value of a variable in the current environment.
       */
      set(name, value) {
        return this.declareVariable(name, convertToRuntimeValues(value));
      }
      declareVariable(name, value) {
        if (this.variables.has(name)) {
          throw new SyntaxError(`Variable already declared: ${name}`);
        }
        this.variables.set(name, value);
        return value;
      }
      // private assignVariable(name: string, value: AnyRuntimeValue): AnyRuntimeValue {
      // 	const env = this.resolve(name);
      // 	env.variables.set(name, value);
      // 	return value;
      // }
      /**
       * Set variable in the current scope.
       * See https://jinja.palletsprojects.com/en/3.0.x/templates/#assignments for more information.
       */
      setVariable(name, value) {
        this.variables.set(name, value);
        return value;
      }
      /**
       * Resolve the environment in which the variable is declared.
       * @param {string} name The name of the variable.
       * @returns {Environment} The environment in which the variable is declared.
       */
      resolve(name) {
        if (this.variables.has(name)) {
          return this;
        }
        if (this.parent) {
          return this.parent.resolve(name);
        }
        throw new Error(`Unknown variable: ${name}`);
      }
      lookupVariable(name) {
        try {
          return this.resolve(name).variables.get(name) ?? new UndefinedValue();
        } catch {
          return new UndefinedValue();
        }
      }
    };
    function setupGlobals(env) {
      env.set("false", false);
      env.set("true", true);
      env.set("none", null);
      env.set("raise_exception", (args) => {
        throw new Error(args);
      });
      env.set("range", range);
      env.set("strftime_now", strftime_now);
      env.set("True", true);
      env.set("False", false);
      env.set("None", null);
    }
    function getAttributeValue(item, attributePath) {
      const parts = attributePath.split(".");
      let value = item;
      for (const part of parts) {
        if (value instanceof ObjectValue) {
          value = value.value.get(part) ?? new UndefinedValue();
        } else if (value instanceof ArrayValue) {
          const index = parseInt(part, 10);
          if (!isNaN(index) && index >= 0 && index < value.value.length) {
            value = value.value[index];
          } else {
            return new UndefinedValue();
          }
        } else {
          return new UndefinedValue();
        }
      }
      return value;
    }
    function compareRuntimeValues(a, b, caseSensitive = false) {
      if (a instanceof NullValue && b instanceof NullValue) {
        return 0;
      }
      if (a instanceof NullValue || b instanceof NullValue) {
        throw new Error(`Cannot compare ${a.type} with ${b.type}`);
      }
      if (a instanceof UndefinedValue && b instanceof UndefinedValue) {
        return 0;
      }
      if (a instanceof UndefinedValue || b instanceof UndefinedValue) {
        throw new Error(`Cannot compare ${a.type} with ${b.type}`);
      }
      const isNumericLike = (v) => v instanceof IntegerValue || v instanceof FloatValue || v instanceof BooleanValue;
      const getNumericValue = (v) => {
        if (v instanceof BooleanValue) {
          return v.value ? 1 : 0;
        }
        return v.value;
      };
      if (isNumericLike(a) && isNumericLike(b)) {
        const aNum = getNumericValue(a);
        const bNum = getNumericValue(b);
        return aNum < bNum ? -1 : aNum > bNum ? 1 : 0;
      }
      if (a.type !== b.type) {
        throw new Error(`Cannot compare different types: ${a.type} and ${b.type}`);
      }
      switch (a.type) {
        case "StringValue": {
          let aStr = a.value;
          let bStr = b.value;
          if (!caseSensitive) {
            aStr = aStr.toLowerCase();
            bStr = bStr.toLowerCase();
          }
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        }
        default:
          throw new Error(`Cannot compare type: ${a.type}`);
      }
    }
    var Interpreter = class {
      global;
      constructor(env) {
        this.global = env ?? new Environment();
      }
      /**
       * Run the program.
       */
      run(program) {
        return this.evaluate(program, this.global);
      }
      /**
       * Evaluates expressions following the binary operation type.
       */
      evaluateBinaryExpression(node, environment) {
        const left = this.evaluate(node.left, environment);
        switch (node.operator.value) {
          case "and":
            return left.__bool__().value ? this.evaluate(node.right, environment) : left;
          case "or":
            return left.__bool__().value ? left : this.evaluate(node.right, environment);
        }
        const right = this.evaluate(node.right, environment);
        switch (node.operator.value) {
          case "==":
            return new BooleanValue(left.value == right.value);
          case "!=":
            return new BooleanValue(left.value != right.value);
        }
        if (left instanceof UndefinedValue || right instanceof UndefinedValue) {
          if (right instanceof UndefinedValue && ["in", "not in"].includes(node.operator.value)) {
            return new BooleanValue(node.operator.value === "not in");
          }
          throw new Error(`Cannot perform operation ${node.operator.value} on undefined values`);
        } else if (left instanceof NullValue || right instanceof NullValue) {
          throw new Error("Cannot perform operation on null values");
        } else if (node.operator.value === "~") {
          return new StringValue(left.value.toString() + right.value.toString());
        } else if ((left instanceof IntegerValue || left instanceof FloatValue) && (right instanceof IntegerValue || right instanceof FloatValue)) {
          const a = left.value, b = right.value;
          switch (node.operator.value) {
            case "+":
            case "-":
            case "*": {
              const res = node.operator.value === "+" ? a + b : node.operator.value === "-" ? a - b : a * b;
              const isFloat = left instanceof FloatValue || right instanceof FloatValue;
              return isFloat ? new FloatValue(res) : new IntegerValue(res);
            }
            case "/":
              return new FloatValue(a / b);
            case "%": {
              const rem = a % b;
              const isFloat = left instanceof FloatValue || right instanceof FloatValue;
              return isFloat ? new FloatValue(rem) : new IntegerValue(rem);
            }
            case "<":
              return new BooleanValue(a < b);
            case ">":
              return new BooleanValue(a > b);
            case ">=":
              return new BooleanValue(a >= b);
            case "<=":
              return new BooleanValue(a <= b);
          }
        } else if (left instanceof ArrayValue && right instanceof ArrayValue) {
          switch (node.operator.value) {
            case "+":
              return new ArrayValue(left.value.concat(right.value));
          }
        } else if (right instanceof ArrayValue) {
          const member = right.value.find((x) => x.value === left.value) !== void 0;
          switch (node.operator.value) {
            case "in":
              return new BooleanValue(member);
            case "not in":
              return new BooleanValue(!member);
          }
        }
        if (left instanceof StringValue || right instanceof StringValue) {
          switch (node.operator.value) {
            case "+":
              return new StringValue(left.value.toString() + right.value.toString());
          }
        }
        if (left instanceof StringValue && right instanceof StringValue) {
          switch (node.operator.value) {
            case "in":
              return new BooleanValue(right.value.includes(left.value));
            case "not in":
              return new BooleanValue(!right.value.includes(left.value));
          }
        }
        if (left instanceof StringValue && right instanceof ObjectValue) {
          switch (node.operator.value) {
            case "in":
              return new BooleanValue(right.value.has(left.value));
            case "not in":
              return new BooleanValue(!right.value.has(left.value));
          }
        }
        throw new SyntaxError(`Unknown operator "${node.operator.value}" between ${left.type} and ${right.type}`);
      }
      evaluateArguments(args, environment) {
        const positionalArguments = [];
        const keywordArguments = /* @__PURE__ */ new Map();
        for (const argument of args) {
          if (argument.type === "SpreadExpression") {
            const spreadNode = argument;
            const val = this.evaluate(spreadNode.argument, environment);
            if (!(val instanceof ArrayValue)) {
              throw new Error(`Cannot unpack non-iterable type: ${val.type}`);
            }
            for (const item of val.value) {
              positionalArguments.push(item);
            }
          } else if (argument.type === "KeywordArgumentExpression") {
            const kwarg = argument;
            keywordArguments.set(kwarg.key.value, this.evaluate(kwarg.value, environment));
          } else {
            if (keywordArguments.size > 0) {
              throw new Error("Positional arguments must come before keyword arguments");
            }
            positionalArguments.push(this.evaluate(argument, environment));
          }
        }
        return [positionalArguments, keywordArguments];
      }
      applyFilter(operand, filterNode, environment) {
        if (filterNode.type === "Identifier") {
          const filter = filterNode;
          if (filter.value === "tojson") {
            return new StringValue(toJSON(operand));
          }
          if (operand instanceof ArrayValue) {
            switch (filter.value) {
              case "list":
                return operand;
              case "first":
                return operand.value[0];
              case "last":
                return operand.value[operand.value.length - 1];
              case "length":
                return new IntegerValue(operand.value.length);
              case "reverse":
                return new ArrayValue(operand.value.slice().reverse());
              case "sort": {
                return new ArrayValue(operand.value.slice().sort((a, b) => compareRuntimeValues(a, b, false)));
              }
              case "join":
                return new StringValue(operand.value.map((x) => x.value).join(""));
              case "string":
                return new StringValue(toJSON(operand, null, 0, false));
              case "unique": {
                const seen = /* @__PURE__ */ new Set();
                const output = [];
                for (const item of operand.value) {
                  if (!seen.has(item.value)) {
                    seen.add(item.value);
                    output.push(item);
                  }
                }
                return new ArrayValue(output);
              }
              default:
                throw new Error(`Unknown ArrayValue filter: ${filter.value}`);
            }
          } else if (operand instanceof StringValue) {
            switch (filter.value) {
              case "length":
              case "upper":
              case "lower":
              case "title":
              case "capitalize": {
                const builtin = operand.builtins.get(filter.value);
                if (builtin instanceof FunctionValue) {
                  return builtin.value(
                    /* no arguments */
                    [],
                    environment
                  );
                } else if (builtin instanceof IntegerValue) {
                  return builtin;
                } else {
                  throw new Error(`Unknown StringValue filter: ${filter.value}`);
                }
              }
              case "trim":
                return new StringValue(operand.value.trim());
              case "indent":
                return new StringValue(
                  operand.value.split("\n").map(
                    (x, i) => (
                      // By default, don't indent the first line or empty lines
                      i === 0 || x.length === 0 ? x : "    " + x
                    )
                  ).join("\n")
                );
              case "join":
              case "string":
                return operand;
              case "int": {
                const val = parseInt(operand.value, 10);
                return new IntegerValue(isNaN(val) ? 0 : val);
              }
              case "float": {
                const val = parseFloat(operand.value);
                return new FloatValue(isNaN(val) ? 0 : val);
              }
              default:
                throw new Error(`Unknown StringValue filter: ${filter.value}`);
            }
          } else if (operand instanceof IntegerValue || operand instanceof FloatValue) {
            switch (filter.value) {
              case "abs":
                return operand instanceof IntegerValue ? new IntegerValue(Math.abs(operand.value)) : new FloatValue(Math.abs(operand.value));
              case "int":
                return new IntegerValue(Math.floor(operand.value));
              case "float":
                return new FloatValue(operand.value);
              default:
                throw new Error(`Unknown NumericValue filter: ${filter.value}`);
            }
          } else if (operand instanceof ObjectValue) {
            switch (filter.value) {
              case "items":
                return new ArrayValue(
                  Array.from(operand.value.entries()).map(([key, value]) => new ArrayValue([new StringValue(key), value]))
                );
              case "length":
                return new IntegerValue(operand.value.size);
              default: {
                const builtin = operand.builtins.get(filter.value);
                if (builtin) {
                  if (builtin instanceof FunctionValue) {
                    return builtin.value([], environment);
                  }
                  return builtin;
                }
                throw new Error(`Unknown ObjectValue filter: ${filter.value}`);
              }
            }
          } else if (operand instanceof BooleanValue) {
            switch (filter.value) {
              case "bool":
                return new BooleanValue(operand.value);
              case "int":
                return new IntegerValue(operand.value ? 1 : 0);
              case "float":
                return new FloatValue(operand.value ? 1 : 0);
              case "string":
                return new StringValue(operand.value ? "true" : "false");
              default:
                throw new Error(`Unknown BooleanValue filter: ${filter.value}`);
            }
          }
          throw new Error(`Cannot apply filter "${filter.value}" to type: ${operand.type}`);
        } else if (filterNode.type === "CallExpression") {
          const filter = filterNode;
          if (filter.callee.type !== "Identifier") {
            throw new Error(`Unknown filter: ${filter.callee.type}`);
          }
          const filterName = filter.callee.value;
          if (filterName === "tojson") {
            const [, kwargs] = this.evaluateArguments(filter.args, environment);
            const indent = kwargs.get("indent") ?? new NullValue();
            if (!(indent instanceof IntegerValue || indent instanceof NullValue)) {
              throw new Error("If set, indent must be a number");
            }
            return new StringValue(toJSON(operand, indent.value));
          } else if (filterName === "join") {
            let value;
            if (operand instanceof StringValue) {
              value = Array.from(operand.value);
            } else if (operand instanceof ArrayValue) {
              value = operand.value.map((x) => x.value);
            } else {
              throw new Error(`Cannot apply filter "${filterName}" to type: ${operand.type}`);
            }
            const [args, kwargs] = this.evaluateArguments(filter.args, environment);
            const separator = args.at(0) ?? kwargs.get("separator") ?? new StringValue("");
            if (!(separator instanceof StringValue)) {
              throw new Error("separator must be a string");
            }
            return new StringValue(value.join(separator.value));
          } else if (filterName === "int" || filterName === "float") {
            const [args, kwargs] = this.evaluateArguments(filter.args, environment);
            const defaultValue = args.at(0) ?? kwargs.get("default") ?? (filterName === "int" ? new IntegerValue(0) : new FloatValue(0));
            if (operand instanceof StringValue) {
              const val = filterName === "int" ? parseInt(operand.value, 10) : parseFloat(operand.value);
              return isNaN(val) ? defaultValue : filterName === "int" ? new IntegerValue(val) : new FloatValue(val);
            } else if (operand instanceof IntegerValue || operand instanceof FloatValue) {
              return operand;
            } else if (operand instanceof BooleanValue) {
              return filterName === "int" ? new IntegerValue(operand.value ? 1 : 0) : new FloatValue(operand.value ? 1 : 0);
            } else {
              throw new Error(`Cannot apply filter "${filterName}" to type: ${operand.type}`);
            }
          } else if (filterName === "default") {
            const [args, kwargs] = this.evaluateArguments(filter.args, environment);
            const defaultValue = args[0] ?? new StringValue("");
            const booleanValue = args[1] ?? kwargs.get("boolean") ?? new BooleanValue(false);
            if (!(booleanValue instanceof BooleanValue)) {
              throw new Error("`default` filter flag must be a boolean");
            }
            if (operand instanceof UndefinedValue || booleanValue.value && !operand.__bool__().value) {
              return defaultValue;
            }
            return operand;
          }
          if (operand instanceof ArrayValue) {
            switch (filterName) {
              case "sort": {
                const [args, kwargs] = this.evaluateArguments(filter.args, environment);
                const reverse = args.at(0) ?? kwargs.get("reverse") ?? new BooleanValue(false);
                if (!(reverse instanceof BooleanValue)) {
                  throw new Error("reverse must be a boolean");
                }
                const caseSensitive = args.at(1) ?? kwargs.get("case_sensitive") ?? new BooleanValue(false);
                if (!(caseSensitive instanceof BooleanValue)) {
                  throw new Error("case_sensitive must be a boolean");
                }
                const attribute = args.at(2) ?? kwargs.get("attribute") ?? new NullValue();
                if (!(attribute instanceof StringValue || attribute instanceof IntegerValue || attribute instanceof NullValue)) {
                  throw new Error("attribute must be a string, integer, or null");
                }
                const getSortValue = (item) => {
                  if (attribute instanceof NullValue) {
                    return item;
                  }
                  const attrPath = attribute instanceof IntegerValue ? String(attribute.value) : attribute.value;
                  return getAttributeValue(item, attrPath);
                };
                return new ArrayValue(
                  operand.value.slice().sort((a, b) => {
                    const aVal = getSortValue(a);
                    const bVal = getSortValue(b);
                    const result = compareRuntimeValues(aVal, bVal, caseSensitive.value);
                    return reverse.value ? -result : result;
                  })
                );
              }
              case "selectattr":
              case "rejectattr": {
                const select = filterName === "selectattr";
                if (operand.value.some((x) => !(x instanceof ObjectValue))) {
                  throw new Error(`\`${filterName}\` can only be applied to array of objects`);
                }
                if (filter.args.some((x) => x.type !== "StringLiteral")) {
                  throw new Error(`arguments of \`${filterName}\` must be strings`);
                }
                const [attr, testName, value] = filter.args.map((x) => this.evaluate(x, environment));
                let testFunction;
                if (testName) {
                  const test = environment.tests.get(testName.value);
                  if (!test) {
                    throw new Error(`Unknown test: ${testName.value}`);
                  }
                  testFunction = test;
                } else {
                  testFunction = (...x) => x[0].__bool__().value;
                }
                const filtered = operand.value.filter((item) => {
                  const a = item.value.get(attr.value);
                  const result = a ? testFunction(a, value) : false;
                  return select ? result : !result;
                });
                return new ArrayValue(filtered);
              }
              case "map": {
                const [, kwargs] = this.evaluateArguments(filter.args, environment);
                if (kwargs.has("attribute")) {
                  const attr = kwargs.get("attribute");
                  if (!(attr instanceof StringValue)) {
                    throw new Error("attribute must be a string");
                  }
                  const defaultValue = kwargs.get("default");
                  const mapped = operand.value.map((item) => {
                    if (!(item instanceof ObjectValue)) {
                      throw new Error("items in map must be an object");
                    }
                    const value = getAttributeValue(item, attr.value);
                    return value instanceof UndefinedValue ? defaultValue ?? new UndefinedValue() : value;
                  });
                  return new ArrayValue(mapped);
                } else {
                  throw new Error("`map` expressions without `attribute` set are not currently supported.");
                }
              }
            }
            throw new Error(`Unknown ArrayValue filter: ${filterName}`);
          } else if (operand instanceof StringValue) {
            switch (filterName) {
              case "indent": {
                const [args, kwargs] = this.evaluateArguments(filter.args, environment);
                const width = args.at(0) ?? kwargs.get("width") ?? new IntegerValue(4);
                if (!(width instanceof IntegerValue)) {
                  throw new Error("width must be a number");
                }
                const first = args.at(1) ?? kwargs.get("first") ?? new BooleanValue(false);
                const blank = args.at(2) ?? kwargs.get("blank") ?? new BooleanValue(false);
                const lines = operand.value.split("\n");
                const indent = " ".repeat(width.value);
                const indented = lines.map(
                  (x, i) => !first.value && i === 0 || !blank.value && x.length === 0 ? x : indent + x
                );
                return new StringValue(indented.join("\n"));
              }
              case "replace": {
                const replaceFn = operand.builtins.get("replace");
                if (!(replaceFn instanceof FunctionValue)) {
                  throw new Error("replace filter not available");
                }
                const [args, kwargs] = this.evaluateArguments(filter.args, environment);
                return replaceFn.value([...args, new KeywordArgumentsValue(kwargs)], environment);
              }
            }
            throw new Error(`Unknown StringValue filter: ${filterName}`);
          } else if (operand instanceof ObjectValue) {
            const builtin = operand.builtins.get(filterName);
            if (builtin && builtin instanceof FunctionValue) {
              const [args, kwargs] = this.evaluateArguments(filter.args, environment);
              if (kwargs.size > 0) {
                args.push(new KeywordArgumentsValue(kwargs));
              }
              return builtin.value(args, environment);
            }
            throw new Error(`Unknown ObjectValue filter: ${filterName}`);
          } else {
            throw new Error(`Cannot apply filter "${filterName}" to type: ${operand.type}`);
          }
        }
        throw new Error(`Unknown filter: ${filterNode.type}`);
      }
      /**
       * Evaluates expressions following the filter operation type.
       */
      evaluateFilterExpression(node, environment) {
        const operand = this.evaluate(node.operand, environment);
        return this.applyFilter(operand, node.filter, environment);
      }
      /**
       * Evaluates expressions following the test operation type.
       */
      evaluateTestExpression(node, environment) {
        const operand = this.evaluate(node.operand, environment);
        const test = environment.tests.get(node.test.value);
        if (!test) {
          throw new Error(`Unknown test: ${node.test.value}`);
        }
        const result = test(operand);
        return new BooleanValue(node.negate ? !result : result);
      }
      /**
       * Evaluates expressions following the select operation type.
       */
      evaluateSelectExpression(node, environment) {
        const predicate = this.evaluate(node.test, environment);
        if (!predicate.__bool__().value) {
          return new UndefinedValue();
        }
        return this.evaluate(node.lhs, environment);
      }
      /**
       * Evaluates expressions following the unary operation type.
       */
      evaluateUnaryExpression(node, environment) {
        const argument = this.evaluate(node.argument, environment);
        switch (node.operator.value) {
          case "not":
            return new BooleanValue(!argument.value);
          default:
            throw new SyntaxError(`Unknown operator: ${node.operator.value}`);
        }
      }
      evaluateTernaryExpression(node, environment) {
        const cond = this.evaluate(node.condition, environment);
        return cond.__bool__().value ? this.evaluate(node.trueExpr, environment) : this.evaluate(node.falseExpr, environment);
      }
      evalProgram(program, environment) {
        return this.evaluateBlock(program.body, environment);
      }
      evaluateBlock(statements, environment) {
        let result = "";
        for (const statement of statements) {
          const lastEvaluated = this.evaluate(statement, environment);
          if (lastEvaluated.type !== "NullValue" && lastEvaluated.type !== "UndefinedValue") {
            result += lastEvaluated.toString();
          }
        }
        return new StringValue(result);
      }
      evaluateIdentifier(node, environment) {
        return environment.lookupVariable(node.value);
      }
      evaluateCallExpression(expr, environment) {
        const [args, kwargs] = this.evaluateArguments(expr.args, environment);
        if (kwargs.size > 0) {
          args.push(new KeywordArgumentsValue(kwargs));
        }
        const fn = this.evaluate(expr.callee, environment);
        if (fn.type !== "FunctionValue") {
          throw new Error(`Cannot call something that is not a function: got ${fn.type}`);
        }
        return fn.value(args, environment);
      }
      evaluateSliceExpression(object, expr, environment) {
        if (!(object instanceof ArrayValue || object instanceof StringValue)) {
          throw new Error("Slice object must be an array or string");
        }
        const start = this.evaluate(expr.start, environment);
        const stop = this.evaluate(expr.stop, environment);
        const step = this.evaluate(expr.step, environment);
        if (!(start instanceof IntegerValue || start instanceof UndefinedValue)) {
          throw new Error("Slice start must be numeric or undefined");
        }
        if (!(stop instanceof IntegerValue || stop instanceof UndefinedValue)) {
          throw new Error("Slice stop must be numeric or undefined");
        }
        if (!(step instanceof IntegerValue || step instanceof UndefinedValue)) {
          throw new Error("Slice step must be numeric or undefined");
        }
        if (object instanceof ArrayValue) {
          return new ArrayValue(slice(object.value, start.value, stop.value, step.value));
        } else {
          return new StringValue(slice(Array.from(object.value), start.value, stop.value, step.value).join(""));
        }
      }
      evaluateMemberExpression(expr, environment) {
        const object = this.evaluate(expr.object, environment);
        let property;
        if (expr.computed) {
          if (expr.property.type === "SliceExpression") {
            return this.evaluateSliceExpression(object, expr.property, environment);
          } else {
            property = this.evaluate(expr.property, environment);
          }
        } else {
          property = new StringValue(expr.property.value);
        }
        let value;
        if (object instanceof ObjectValue) {
          if (!(property instanceof StringValue)) {
            throw new Error(`Cannot access property with non-string: got ${property.type}`);
          }
          value = object.value.get(property.value) ?? object.builtins.get(property.value);
        } else if (object instanceof ArrayValue || object instanceof StringValue) {
          if (property instanceof IntegerValue) {
            value = object.value.at(property.value);
            if (object instanceof StringValue) {
              value = new StringValue(object.value.at(property.value));
            }
          } else if (property instanceof StringValue) {
            value = object.builtins.get(property.value);
          } else {
            throw new Error(`Cannot access property with non-string/non-number: got ${property.type}`);
          }
        } else {
          if (!(property instanceof StringValue)) {
            throw new Error(`Cannot access property with non-string: got ${property.type}`);
          }
          value = object.builtins.get(property.value);
        }
        return value instanceof RuntimeValue ? value : new UndefinedValue();
      }
      evaluateSet(node, environment) {
        const rhs = node.value ? this.evaluate(node.value, environment) : this.evaluateBlock(node.body, environment);
        if (node.assignee.type === "Identifier") {
          const variableName = node.assignee.value;
          environment.setVariable(variableName, rhs);
        } else if (node.assignee.type === "TupleLiteral") {
          const tuple = node.assignee;
          if (!(rhs instanceof ArrayValue)) {
            throw new Error(`Cannot unpack non-iterable type in set: ${rhs.type}`);
          }
          const arr = rhs.value;
          if (arr.length !== tuple.value.length) {
            throw new Error(`Too ${tuple.value.length > arr.length ? "few" : "many"} items to unpack in set`);
          }
          for (let i = 0; i < tuple.value.length; ++i) {
            const elem = tuple.value[i];
            if (elem.type !== "Identifier") {
              throw new Error(`Cannot unpack to non-identifier in set: ${elem.type}`);
            }
            environment.setVariable(elem.value, arr[i]);
          }
        } else if (node.assignee.type === "MemberExpression") {
          const member = node.assignee;
          const object = this.evaluate(member.object, environment);
          if (!(object instanceof ObjectValue)) {
            throw new Error("Cannot assign to member of non-object");
          }
          if (member.property.type !== "Identifier") {
            throw new Error("Cannot assign to member with non-identifier property");
          }
          object.value.set(member.property.value, rhs);
        } else {
          throw new Error(`Invalid LHS inside assignment expression: ${JSON.stringify(node.assignee)}`);
        }
        return new NullValue();
      }
      evaluateIf(node, environment) {
        const test = this.evaluate(node.test, environment);
        return this.evaluateBlock(test.__bool__().value ? node.body : node.alternate, environment);
      }
      evaluateFor(node, environment) {
        const scope = new Environment(environment);
        let test, iterable;
        if (node.iterable.type === "SelectExpression") {
          const select = node.iterable;
          iterable = this.evaluate(select.lhs, scope);
          test = select.test;
        } else {
          iterable = this.evaluate(node.iterable, scope);
        }
        if (!(iterable instanceof ArrayValue || iterable instanceof ObjectValue)) {
          throw new Error(`Expected iterable or object type in for loop: got ${iterable.type}`);
        }
        if (iterable instanceof ObjectValue) {
          iterable = iterable.keys();
        }
        const items = [];
        const scopeUpdateFunctions = [];
        for (let i = 0; i < iterable.value.length; ++i) {
          const loopScope = new Environment(scope);
          const current = iterable.value[i];
          let scopeUpdateFunction;
          if (node.loopvar.type === "Identifier") {
            scopeUpdateFunction = (scope2) => scope2.setVariable(node.loopvar.value, current);
          } else if (node.loopvar.type === "TupleLiteral") {
            const loopvar = node.loopvar;
            if (current.type !== "ArrayValue") {
              throw new Error(`Cannot unpack non-iterable type: ${current.type}`);
            }
            const c = current;
            if (loopvar.value.length !== c.value.length) {
              throw new Error(`Too ${loopvar.value.length > c.value.length ? "few" : "many"} items to unpack`);
            }
            scopeUpdateFunction = (scope2) => {
              for (let j = 0; j < loopvar.value.length; ++j) {
                if (loopvar.value[j].type !== "Identifier") {
                  throw new Error(`Cannot unpack non-identifier type: ${loopvar.value[j].type}`);
                }
                scope2.setVariable(loopvar.value[j].value, c.value[j]);
              }
            };
          } else {
            throw new Error(`Invalid loop variable(s): ${node.loopvar.type}`);
          }
          if (test) {
            scopeUpdateFunction(loopScope);
            const testValue = this.evaluate(test, loopScope);
            if (!testValue.__bool__().value) {
              continue;
            }
          }
          items.push(current);
          scopeUpdateFunctions.push(scopeUpdateFunction);
        }
        let result = "";
        let noIteration = true;
        for (let i = 0; i < items.length; ++i) {
          const loop = /* @__PURE__ */ new Map([
            ["index", new IntegerValue(i + 1)],
            ["index0", new IntegerValue(i)],
            ["revindex", new IntegerValue(items.length - i)],
            ["revindex0", new IntegerValue(items.length - i - 1)],
            ["first", new BooleanValue(i === 0)],
            ["last", new BooleanValue(i === items.length - 1)],
            ["length", new IntegerValue(items.length)],
            ["previtem", i > 0 ? items[i - 1] : new UndefinedValue()],
            ["nextitem", i < items.length - 1 ? items[i + 1] : new UndefinedValue()]
          ]);
          scope.setVariable("loop", new ObjectValue(loop));
          scopeUpdateFunctions[i](scope);
          try {
            const evaluated = this.evaluateBlock(node.body, scope);
            result += evaluated.value;
          } catch (err) {
            if (err instanceof ContinueControl) {
              continue;
            }
            if (err instanceof BreakControl) {
              break;
            }
            throw err;
          }
          noIteration = false;
        }
        if (noIteration) {
          const defaultEvaluated = this.evaluateBlock(node.defaultBlock, scope);
          result += defaultEvaluated.value;
        }
        return new StringValue(result);
      }
      /**
       * See https://jinja.palletsprojects.com/en/3.1.x/templates/#macros for more information.
       */
      evaluateMacro(node, environment) {
        environment.setVariable(
          node.name.value,
          new FunctionValue((args, scope) => {
            const macroScope = new Environment(scope);
            args = args.slice();
            let kwargs;
            if (args.at(-1)?.type === "KeywordArgumentsValue") {
              kwargs = args.pop();
            }
            for (let i = 0; i < node.args.length; ++i) {
              const nodeArg = node.args[i];
              const passedArg = args[i];
              if (nodeArg.type === "Identifier") {
                const identifier = nodeArg;
                if (!passedArg) {
                  throw new Error(`Missing positional argument: ${identifier.value}`);
                }
                macroScope.setVariable(identifier.value, passedArg);
              } else if (nodeArg.type === "KeywordArgumentExpression") {
                const kwarg = nodeArg;
                const value = passedArg ?? // Try positional arguments first
                kwargs?.value.get(kwarg.key.value) ?? // Look in user-passed kwargs
                this.evaluate(kwarg.value, macroScope);
                macroScope.setVariable(kwarg.key.value, value);
              } else {
                throw new Error(`Unknown argument type: ${nodeArg.type}`);
              }
            }
            return this.evaluateBlock(node.body, macroScope);
          })
        );
        return new NullValue();
      }
      evaluateCallStatement(node, environment) {
        const callerFn = new FunctionValue((callerArgs, callerEnv) => {
          const callBlockEnv = new Environment(callerEnv);
          if (node.callerArgs) {
            for (let i = 0; i < node.callerArgs.length; ++i) {
              const param = node.callerArgs[i];
              if (param.type !== "Identifier") {
                throw new Error(`Caller parameter must be an identifier, got ${param.type}`);
              }
              callBlockEnv.setVariable(param.value, callerArgs[i] ?? new UndefinedValue());
            }
          }
          return this.evaluateBlock(node.body, callBlockEnv);
        });
        const [macroArgs, macroKwargs] = this.evaluateArguments(node.call.args, environment);
        macroArgs.push(new KeywordArgumentsValue(macroKwargs));
        const fn = this.evaluate(node.call.callee, environment);
        if (fn.type !== "FunctionValue") {
          throw new Error(`Cannot call something that is not a function: got ${fn.type}`);
        }
        const newEnv = new Environment(environment);
        newEnv.setVariable("caller", callerFn);
        return fn.value(macroArgs, newEnv);
      }
      evaluateFilterStatement(node, environment) {
        const rendered = this.evaluateBlock(node.body, environment);
        return this.applyFilter(rendered, node.filter, environment);
      }
      evaluate(statement, environment) {
        if (!statement)
          return new UndefinedValue();
        switch (statement.type) {
          case "Program":
            return this.evalProgram(statement, environment);
          case "Set":
            return this.evaluateSet(statement, environment);
          case "If":
            return this.evaluateIf(statement, environment);
          case "For":
            return this.evaluateFor(statement, environment);
          case "Macro":
            return this.evaluateMacro(statement, environment);
          case "CallStatement":
            return this.evaluateCallStatement(statement, environment);
          case "Break":
            throw new BreakControl();
          case "Continue":
            throw new ContinueControl();
          case "IntegerLiteral":
            return new IntegerValue(statement.value);
          case "FloatLiteral":
            return new FloatValue(statement.value);
          case "StringLiteral":
            return new StringValue(statement.value);
          case "ArrayLiteral":
            return new ArrayValue(statement.value.map((x) => this.evaluate(x, environment)));
          case "TupleLiteral":
            return new TupleValue(statement.value.map((x) => this.evaluate(x, environment)));
          case "ObjectLiteral": {
            const mapping = /* @__PURE__ */ new Map();
            for (const [key, value] of statement.value) {
              const evaluatedKey = this.evaluate(key, environment);
              if (!(evaluatedKey instanceof StringValue)) {
                throw new Error(`Object keys must be strings: got ${evaluatedKey.type}`);
              }
              mapping.set(evaluatedKey.value, this.evaluate(value, environment));
            }
            return new ObjectValue(mapping);
          }
          case "Identifier":
            return this.evaluateIdentifier(statement, environment);
          case "CallExpression":
            return this.evaluateCallExpression(statement, environment);
          case "MemberExpression":
            return this.evaluateMemberExpression(statement, environment);
          case "UnaryExpression":
            return this.evaluateUnaryExpression(statement, environment);
          case "BinaryExpression":
            return this.evaluateBinaryExpression(statement, environment);
          case "FilterExpression":
            return this.evaluateFilterExpression(statement, environment);
          case "FilterStatement":
            return this.evaluateFilterStatement(statement, environment);
          case "TestExpression":
            return this.evaluateTestExpression(statement, environment);
          case "SelectExpression":
            return this.evaluateSelectExpression(statement, environment);
          case "Ternary":
            return this.evaluateTernaryExpression(statement, environment);
          case "Comment":
            return new NullValue();
          default:
            throw new SyntaxError(`Unknown node type: ${statement.type}`);
        }
      }
    };
    function convertToRuntimeValues(input) {
      switch (typeof input) {
        case "number":
          return Number.isInteger(input) ? new IntegerValue(input) : new FloatValue(input);
        case "string":
          return new StringValue(input);
        case "boolean":
          return new BooleanValue(input);
        case "undefined":
          return new UndefinedValue();
        case "object":
          if (input === null) {
            return new NullValue();
          } else if (Array.isArray(input)) {
            return new ArrayValue(input.map(convertToRuntimeValues));
          } else {
            return new ObjectValue(
              new Map(Object.entries(input).map(([key, value]) => [key, convertToRuntimeValues(value)]))
            );
          }
        case "function":
          return new FunctionValue((args, _scope) => {
            const result = input(...args.map((x) => x.value)) ?? null;
            return convertToRuntimeValues(result);
          });
        default:
          throw new Error(`Cannot convert to runtime value: ${input}`);
      }
    }
    var NEWLINE = "\n";
    var OPEN_STATEMENT = "{%- ";
    var CLOSE_STATEMENT = " -%}";
    function getBinaryOperatorPrecedence(expr) {
      switch (expr.operator.type) {
        case "MultiplicativeBinaryOperator":
          return 4;
        case "AdditiveBinaryOperator":
          return 3;
        case "ComparisonBinaryOperator":
          return 2;
        case "Identifier":
          if (expr.operator.value === "and")
            return 1;
          if (expr.operator.value === "in" || expr.operator.value === "not in")
            return 2;
          return 0;
      }
      return 0;
    }
    function format(program, indent = "	") {
      const indentStr = typeof indent === "number" ? " ".repeat(indent) : indent;
      const body = formatStatements(program.body, 0, indentStr);
      return body.replace(/\n$/, "");
    }
    function createStatement(...text) {
      return OPEN_STATEMENT + text.join(" ") + CLOSE_STATEMENT;
    }
    function formatStatements(stmts, depth, indentStr) {
      return stmts.map((stmt) => formatStatement(stmt, depth, indentStr)).join(NEWLINE);
    }
    function formatStatement(node, depth, indentStr) {
      const pad = indentStr.repeat(depth);
      switch (node.type) {
        case "Program":
          return formatStatements(node.body, depth, indentStr);
        case "If":
          return formatIf(node, depth, indentStr);
        case "For":
          return formatFor(node, depth, indentStr);
        case "Set":
          return formatSet(node, depth, indentStr);
        case "Macro":
          return formatMacro(node, depth, indentStr);
        case "Break":
          return pad + createStatement("break");
        case "Continue":
          return pad + createStatement("continue");
        case "CallStatement":
          return formatCallStatement(node, depth, indentStr);
        case "FilterStatement":
          return formatFilterStatement(node, depth, indentStr);
        case "Comment":
          return pad + "{# " + node.value + " #}";
        default:
          return pad + "{{- " + formatExpression(node) + " -}}";
      }
    }
    function formatIf(node, depth, indentStr) {
      const pad = indentStr.repeat(depth);
      const clauses = [];
      let current = node;
      while (current) {
        clauses.push({ test: current.test, body: current.body });
        if (current.alternate.length === 1 && current.alternate[0].type === "If") {
          current = current.alternate[0];
        } else {
          break;
        }
      }
      let out = pad + createStatement("if", formatExpression(clauses[0].test)) + NEWLINE + formatStatements(clauses[0].body, depth + 1, indentStr);
      for (let i = 1; i < clauses.length; ++i) {
        out += NEWLINE + pad + createStatement("elif", formatExpression(clauses[i].test)) + NEWLINE + formatStatements(clauses[i].body, depth + 1, indentStr);
      }
      if (current && current.alternate.length > 0) {
        out += NEWLINE + pad + createStatement("else") + NEWLINE + formatStatements(current.alternate, depth + 1, indentStr);
      }
      out += NEWLINE + pad + createStatement("endif");
      return out;
    }
    function formatFor(node, depth, indentStr) {
      const pad = indentStr.repeat(depth);
      let formattedIterable = "";
      if (node.iterable.type === "SelectExpression") {
        const n = node.iterable;
        formattedIterable = `${formatExpression(n.lhs)} if ${formatExpression(n.test)}`;
      } else {
        formattedIterable = formatExpression(node.iterable);
      }
      let out = pad + createStatement("for", formatExpression(node.loopvar), "in", formattedIterable) + NEWLINE + formatStatements(node.body, depth + 1, indentStr);
      if (node.defaultBlock.length > 0) {
        out += NEWLINE + pad + createStatement("else") + NEWLINE + formatStatements(node.defaultBlock, depth + 1, indentStr);
      }
      out += NEWLINE + pad + createStatement("endfor");
      return out;
    }
    function formatSet(node, depth, indentStr) {
      const pad = indentStr.repeat(depth);
      const left = formatExpression(node.assignee);
      const right = node.value ? formatExpression(node.value) : "";
      const value = pad + createStatement("set", `${left}${node.value ? " = " + right : ""}`);
      if (node.body.length === 0) {
        return value;
      }
      return value + NEWLINE + formatStatements(node.body, depth + 1, indentStr) + NEWLINE + pad + createStatement("endset");
    }
    function formatMacro(node, depth, indentStr) {
      const pad = indentStr.repeat(depth);
      const args = node.args.map(formatExpression).join(", ");
      return pad + createStatement("macro", `${node.name.value}(${args})`) + NEWLINE + formatStatements(node.body, depth + 1, indentStr) + NEWLINE + pad + createStatement("endmacro");
    }
    function formatCallStatement(node, depth, indentStr) {
      const pad = indentStr.repeat(depth);
      const params = node.callerArgs && node.callerArgs.length > 0 ? `(${node.callerArgs.map(formatExpression).join(", ")})` : "";
      const callExpr = formatExpression(node.call);
      let out = pad + createStatement(`call${params}`, callExpr) + NEWLINE;
      out += formatStatements(node.body, depth + 1, indentStr) + NEWLINE;
      out += pad + createStatement("endcall");
      return out;
    }
    function formatFilterStatement(node, depth, indentStr) {
      const pad = indentStr.repeat(depth);
      const spec = node.filter.type === "Identifier" ? node.filter.value : formatExpression(node.filter);
      let out = pad + createStatement("filter", spec) + NEWLINE;
      out += formatStatements(node.body, depth + 1, indentStr) + NEWLINE;
      out += pad + createStatement("endfilter");
      return out;
    }
    function formatExpression(node, parentPrec = -1) {
      switch (node.type) {
        case "SpreadExpression": {
          const n = node;
          return `*${formatExpression(n.argument)}`;
        }
        case "Identifier":
          return node.value;
        case "IntegerLiteral":
          return `${node.value}`;
        case "FloatLiteral":
          return `${node.value}`;
        case "StringLiteral":
          return JSON.stringify(node.value);
        case "BinaryExpression": {
          const n = node;
          const thisPrecedence = getBinaryOperatorPrecedence(n);
          const left = formatExpression(n.left, thisPrecedence);
          const right = formatExpression(n.right, thisPrecedence + 1);
          const expr = `${left} ${n.operator.value} ${right}`;
          return thisPrecedence < parentPrec ? `(${expr})` : expr;
        }
        case "UnaryExpression": {
          const n = node;
          const val = n.operator.value + (n.operator.value === "not" ? " " : "") + formatExpression(n.argument, Infinity);
          return val;
        }
        case "CallExpression": {
          const n = node;
          const args = n.args.map(formatExpression).join(", ");
          return `${formatExpression(n.callee)}(${args})`;
        }
        case "MemberExpression": {
          const n = node;
          let obj = formatExpression(n.object);
          if (![
            "Identifier",
            "MemberExpression",
            "CallExpression",
            "StringLiteral",
            "IntegerLiteral",
            "FloatLiteral",
            "ArrayLiteral",
            "TupleLiteral",
            "ObjectLiteral"
          ].includes(n.object.type)) {
            obj = `(${obj})`;
          }
          let prop = formatExpression(n.property);
          if (!n.computed && n.property.type !== "Identifier") {
            prop = `(${prop})`;
          }
          return n.computed ? `${obj}[${prop}]` : `${obj}.${prop}`;
        }
        case "FilterExpression": {
          const n = node;
          const operand = formatExpression(n.operand, Infinity);
          if (n.filter.type === "CallExpression") {
            return `${operand} | ${formatExpression(n.filter)}`;
          }
          return `${operand} | ${n.filter.value}`;
        }
        case "SelectExpression": {
          const n = node;
          return `${formatExpression(n.lhs)} if ${formatExpression(n.test)}`;
        }
        case "TestExpression": {
          const n = node;
          return `${formatExpression(n.operand)} is${n.negate ? " not" : ""} ${n.test.value}`;
        }
        case "ArrayLiteral":
        case "TupleLiteral": {
          const elems = node.value.map(formatExpression);
          const brackets = node.type === "ArrayLiteral" ? "[]" : "()";
          return `${brackets[0]}${elems.join(", ")}${brackets[1]}`;
        }
        case "ObjectLiteral": {
          const entries = Array.from(node.value.entries()).map(
            ([k, v]) => `${formatExpression(k)}: ${formatExpression(v)}`
          );
          return `{${entries.join(", ")}}`;
        }
        case "SliceExpression": {
          const n = node;
          const s = n.start ? formatExpression(n.start) : "";
          const t = n.stop ? formatExpression(n.stop) : "";
          const st = n.step ? `:${formatExpression(n.step)}` : "";
          return `${s}:${t}${st}`;
        }
        case "KeywordArgumentExpression": {
          const n = node;
          return `${n.key.value}=${formatExpression(n.value)}`;
        }
        case "Ternary": {
          const n = node;
          const expr = `${formatExpression(n.trueExpr)} if ${formatExpression(n.condition, 0)} else ${formatExpression(
            n.falseExpr
          )}`;
          return parentPrec > -1 ? `(${expr})` : expr;
        }
        default:
          throw new Error(`Unknown expression type: ${node.type}`);
      }
    }
    var Template = class {
      parsed;
      /**
       * @param {string} template The template string
       */
      constructor(template) {
        const tokens = tokenize(template, {
          lstrip_blocks: true,
          trim_blocks: true
        });
        this.parsed = parse(tokens);
      }
      render(items) {
        const env = new Environment();
        setupGlobals(env);
        if (items) {
          for (const [key, value] of Object.entries(items)) {
            env.set(key, value);
          }
        }
        const interpreter = new Interpreter(env);
        const result = interpreter.run(this.parsed);
        return result.value;
      }
      format(options) {
        return format(this.parsed, options?.indent || "	");
      }
    };
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/library-to-tasks.js
var require_library_to_tasks = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/library-to-tasks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LIBRARY_TASK_MAPPING = void 0;
    exports2.LIBRARY_TASK_MAPPING = {
      "adapter-transformers": ["question-answering", "text-classification", "token-classification"],
      allennlp: ["question-answering"],
      asteroid: [
        // "audio-source-separation",
        "audio-to-audio"
      ],
      bertopic: ["text-classification"],
      diffusers: ["image-to-image", "text-to-image"],
      doctr: ["object-detection"],
      espnet: ["text-to-speech", "automatic-speech-recognition"],
      fairseq: ["text-to-speech", "audio-to-audio"],
      fastai: ["image-classification"],
      fasttext: ["feature-extraction", "text-classification"],
      flair: ["token-classification"],
      k2: ["automatic-speech-recognition"],
      keras: ["image-classification"],
      nemo: ["automatic-speech-recognition"],
      open_clip: ["zero-shot-classification", "zero-shot-image-classification"],
      paddlenlp: ["fill-mask", "summarization", "zero-shot-classification"],
      peft: ["text-generation"],
      "pyannote-audio": ["automatic-speech-recognition"],
      "sentence-transformers": ["feature-extraction", "sentence-similarity"],
      setfit: ["text-classification"],
      sklearn: ["tabular-classification", "tabular-regression", "text-classification"],
      spacy: ["token-classification", "text-classification", "sentence-similarity"],
      "span-marker": ["token-classification"],
      speechbrain: ["audio-classification", "audio-to-audio", "automatic-speech-recognition", "text-to-speech"],
      stanza: ["token-classification"],
      timm: ["image-classification", "image-feature-extraction"],
      transformers: [
        "audio-classification",
        "automatic-speech-recognition",
        "depth-estimation",
        "document-question-answering",
        "feature-extraction",
        "fill-mask",
        "image-classification",
        "image-feature-extraction",
        "image-segmentation",
        "image-to-image",
        "image-to-text",
        "image-text-to-text",
        "mask-generation",
        "object-detection",
        "question-answering",
        "summarization",
        "table-question-answering",
        "text-classification",
        "text-generation",
        "text-to-audio",
        "text-to-speech",
        "token-classification",
        "translation",
        "video-classification",
        "visual-question-answering",
        "zero-shot-classification",
        "zero-shot-image-classification",
        "zero-shot-object-detection"
      ],
      mindspore: ["image-classification"]
    };
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/default-widget-inputs.js
var require_default_widget_inputs = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/default-widget-inputs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MAPPING_DEFAULT_WIDGET = void 0;
    var MAPPING_EN = /* @__PURE__ */ new Map([
      ["text-classification", [`I like you. I love you`]],
      [
        "token-classification",
        [
          `My name is Wolfgang and I live in Berlin`,
          `My name is Sarah and I live in London`,
          `My name is Clara and I live in Berkeley, California.`
        ]
      ],
      [
        "table-question-answering",
        [
          {
            text: `How many stars does the transformers repository have?`,
            table: {
              Repository: ["Transformers", "Datasets", "Tokenizers"],
              Stars: [36542, 4512, 3934],
              Contributors: [651, 77, 34],
              "Programming language": ["Python", "Python", "Rust, Python and NodeJS"]
            }
          }
        ]
      ],
      [
        "question-answering",
        [
          {
            text: `Where do I live?`,
            context: `My name is Wolfgang and I live in Berlin`
          },
          {
            text: `Where do I live?`,
            context: `My name is Sarah and I live in London`
          },
          {
            text: `What's my name?`,
            context: `My name is Clara and I live in Berkeley.`
          },
          {
            text: `Which name is also used to describe the Amazon rainforest in English?`,
            context: `The Amazon rainforest (Portuguese: Floresta Amaz\xF4nica or Amaz\xF4nia; Spanish: Selva Amaz\xF3nica, Amazon\xEDa or usually Amazonia; French: For\xEAt amazonienne; Dutch: Amazoneregenwoud), also known in English as Amazonia or the Amazon Jungle, is a moist broadleaf forest that covers most of the Amazon basin of South America. This basin encompasses 7,000,000 square kilometres (2,700,000 sq mi), of which 5,500,000 square kilometres (2,100,000 sq mi) are covered by the rainforest. This region includes territory belonging to nine nations. The majority of the forest is contained within Brazil, with 60% of the rainforest, followed by Peru with 13%, Colombia with 10%, and with minor amounts in Venezuela, Ecuador, Bolivia, Guyana, Suriname and French Guiana. States or departments in four nations contain "Amazonas" in their names. The Amazon represents over half of the planet's remaining rainforests, and comprises the largest and most biodiverse tract of tropical rainforest in the world, with an estimated 390 billion individual trees divided into 16,000 species.`
          }
        ]
      ],
      [
        "zero-shot-classification",
        [
          {
            text: "I have a problem with my iphone that needs to be resolved asap!",
            candidate_labels: "urgent, not urgent, phone, tablet, computer",
            multi_class: true
          },
          {
            text: "Last week I upgraded my iOS version and ever since then my phone has been overheating whenever I use your app.",
            candidate_labels: "mobile, website, billing, account access",
            multi_class: false
          },
          {
            text: "A new model offers an explanation for how the Galilean satellites formed around the solar system\u2019s largest world. Konstantin Batygin did not set out to solve one of the solar system\u2019s most puzzling mysteries when he went for a run up a hill in Nice, France. Dr. Batygin, a Caltech researcher, best known for his contributions to the search for the solar system\u2019s missing \u201CPlanet Nine,\u201D spotted a beer bottle. At a steep, 20 degree grade, he wondered why it wasn\u2019t rolling down the hill. He realized there was a breeze at his back holding the bottle in place. Then he had a thought that would only pop into the mind of a theoretical astrophysicist: \u201COh! This is how Europa formed.\u201D Europa is one of Jupiter\u2019s four large Galilean moons. And in a paper published Monday in the Astrophysical Journal, Dr. Batygin and a co-author, Alessandro Morbidelli, a planetary scientist at the C\xF4te d\u2019Azur Observatory in France, present a theory explaining how some moons form around gas giants like Jupiter and Saturn, suggesting that millimeter-sized grains of hail produced during the solar system\u2019s formation became trapped around these massive worlds, taking shape one at a time into the potentially habitable moons we know today.",
            candidate_labels: "space & cosmos, scientific discovery, microbiology, robots, archeology",
            multi_class: true
          }
        ]
      ],
      ["translation", [`My name is Wolfgang and I live in Berlin`, `My name is Sarah and I live in London`]],
      [
        "summarization",
        [
          `The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.`
        ]
      ],
      [
        "conversational",
        [
          `Hi, what can you help me with?`,
          `What is 84 * 3 / 2?`,
          `Tell me an interesting fact about the universe!`,
          `Explain quantum computing in simple terms.`
        ]
      ],
      [
        "text-generation",
        [
          `My name is Julien and I like to`,
          `I like traveling by train because`,
          `Paris is an amazing place to visit,`,
          `Once upon a time,`
        ]
      ],
      ["fill-mask", [`Paris is the <mask> of France.`, `The goal of life is <mask>.`]],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "That is a happy person",
            sentences: ["That is a happy dog", "That is a very happy person", "Today is a sunny day"]
          }
        ]
      ]
    ]);
    var MAPPING_ZH = /* @__PURE__ */ new Map([
      ["text-classification", [`\u6211\u559C\u6B22\u4F60\u3002 \u6211\u7231\u4F60`]],
      ["token-classification", [`\u6211\u53EB\u6C83\u5C14\u592B\u5188\uFF0C\u6211\u4F4F\u5728\u67CF\u6797\u3002`, `\u6211\u53EB\u8428\u62C9\uFF0C\u6211\u4F4F\u5728\u4F26\u6566\u3002`, `\u6211\u53EB\u514B\u62C9\u62C9\uFF0C\u6211\u4F4F\u5728\u52A0\u5DDE\u4F2F\u514B\u5229\u3002`]],
      [
        "question-answering",
        [
          {
            text: `\u6211\u4F4F\u5728\u54EA\u91CC\uFF1F`,
            context: `\u6211\u53EB\u6C83\u5C14\u592B\u5188\uFF0C\u6211\u4F4F\u5728\u67CF\u6797\u3002`
          },
          {
            text: `\u6211\u4F4F\u5728\u54EA\u91CC\uFF1F`,
            context: `\u6211\u53EB\u8428\u62C9\uFF0C\u6211\u4F4F\u5728\u4F26\u6566\u3002`
          },
          {
            text: `\u6211\u7684\u540D\u5B57\u662F\u4EC0\u4E48\uFF1F`,
            context: `\u6211\u53EB\u514B\u62C9\u62C9\uFF0C\u6211\u4F4F\u5728\u4F2F\u514B\u5229\u3002`
          }
        ]
      ],
      ["translation", [`\u6211\u53EB\u6C83\u5C14\u592B\u5188\uFF0C\u6211\u4F4F\u5728\u67CF\u6797\u3002`, `\u6211\u53EB\u8428\u62C9\uFF0C\u6211\u4F4F\u5728\u4F26\u6566\u3002`]],
      [
        "zero-shot-classification",
        [
          {
            text: "\u623F\u95F4\u5E72\u51C0\u660E\u4EAE\uFF0C\u975E\u5E38\u4E0D\u9519",
            candidate_labels: "\u8FD9\u662F\u4E00\u6761\u5DEE\u8BC4, \u8FD9\u662F\u4E00\u6761\u597D\u8BC4"
          }
        ]
      ],
      [
        "summarization",
        [
          `\u8BE5\u5854\u9AD8324\u7C73\uFF081063\u82F1\u5C3A\uFF09\uFF0C\u4E0E\u4E00\u5E6281\u5C42\u7684\u5EFA\u7B51\u7269\u4E00\u6837\u9AD8\uFF0C\u662F\u5DF4\u9ECE\u6700\u9AD8\u7684\u5EFA\u7B51\u7269\u3002 \u5B83\u7684\u5E95\u5EA7\u662F\u65B9\u5F62\u7684\uFF0C\u6BCF\u8FB9\u957F125\u7C73\uFF08410\u82F1\u5C3A\uFF09\u3002 \u5728\u5EFA\u9020\u8FC7\u7A0B\u4E2D\uFF0C\u827E\u83F2\u5C14\u94C1\u5854\u8D85\u8FC7\u4E86\u534E\u76DB\u987F\u7EAA\u5FF5\u7891\uFF0C\u6210\u4E3A\u4E16\u754C\u4E0A\u6700\u9AD8\u7684\u4EBA\u9020\u7ED3\u6784\uFF0C\u5B83\u4FDD\u6301\u4E8641\u5E74\u7684\u5934\u8854\uFF0C\u76F4\u52301930\u5E74\u7EBD\u7EA6\u5E02\u7684\u514B\u83B1\u65AF\u52D2\u5927\u697C\u7AE3\u5DE5\u3002\u8FD9\u662F\u7B2C\u4E00\u4E2A\u5230\u8FBE300\u7C73\u9AD8\u5EA6\u7684\u7ED3\u6784\u3002 \u7531\u4E8E1957\u5E74\u5728\u5854\u9876\u589E\u52A0\u4E86\u5E7F\u64AD\u5929\u7EBF\uFF0C\u56E0\u6B64\u5B83\u73B0\u5728\u6BD4\u514B\u83B1\u65AF\u52D2\u5927\u53A6\u9AD85.2\u7C73\uFF0817\u82F1\u5C3A\uFF09\u3002 \u9664\u53D1\u5C04\u5668\u5916\uFF0C\u827E\u83F2\u5C14\u94C1\u5854\u662F\u6CD5\u56FD\u7B2C\u4E8C\u9AD8\u7684\u72EC\u7ACB\u5F0F\u5EFA\u7B51\uFF0C\u4EC5\u6B21\u4E8E\u7C73\u52B3\u9AD8\u67B6\u6865\u3002`
        ]
      ],
      [
        "text-generation",
        [`\u6211\u53EB\u6731\u5229\u5B89\uFF0C\u6211\u559C\u6B22`, `\u6211\u53EB\u6258\u9A6C\u65AF\uFF0C\u6211\u7684\u4E3B\u8981`, `\u6211\u53EB\u739B\u4E3D\u4E9A\uFF0C\u6211\u6700\u559C\u6B22\u7684`, `\u6211\u53EB\u514B\u62C9\u62C9\uFF0C\u6211\u662F`, `\u4ECE\u524D\uFF0C`]
      ],
      ["fill-mask", [`\u5DF4\u9ECE\u662F<mask>\u56FD\u7684\u9996\u90FD\u3002`, `\u751F\u6D3B\u7684\u771F\u8C1B\u662F<mask>\u3002`]],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "\u90A3\u662F \u500B\u5FEB\u6A02\u7684\u4EBA",
            sentences: ["\u90A3\u662F \u689D\u5FEB\u6A02\u7684\u72D7", "\u90A3\u662F \u500B\u975E\u5E38\u5E78\u798F\u7684\u4EBA", "\u4ECA\u5929\u662F\u6674\u5929"]
          }
        ]
      ]
    ]);
    var MAPPING_FR = /* @__PURE__ */ new Map([
      ["text-classification", [`Je t'appr\xE9cie beaucoup. Je t'aime.`]],
      ["token-classification", [`Mon nom est Wolfgang et je vis \xE0 Berlin`]],
      [
        "question-answering",
        [
          {
            text: `O\xF9 est-ce que je vis?`,
            context: `Mon nom est Wolfgang et je vis \xE0 Berlin`
          }
        ]
      ],
      ["translation", [`Mon nom est Wolfgang et je vis \xE0 Berlin`]],
      [
        "summarization",
        [
          `La tour fait 324 m\xE8tres (1,063 pieds) de haut, environ la m\xEAme hauteur qu'un immeuble de 81 \xE9tages, et est la plus haute structure de Paris. Sa base est carr\xE9e, mesurant 125 m\xE8tres (410 pieds) sur chaque c\xF4t\xE9. Durant sa construction, la tour Eiffel surpassa le Washington Monument pour devenir la plus haute structure construite par l'homme dans le monde, un titre qu'elle conserva pendant 41 ans jusqu'\xE0 l'ach\xE8vement du Chrysler Building \xE0 New-York City en 1930. Ce fut la premi\xE8re structure \xE0 atteindre une hauteur de 300 m\xE8tres. Avec l'ajout d'une antenne de radiodiffusion au sommet de la tour Eiffel en 1957, celle-ci redevint plus haute que le Chrysler Building de 5,2 m\xE8tres (17 pieds). En excluant les transmetteurs, elle est la seconde plus haute structure autoportante de France apr\xE8s le viaduc de Millau.`
        ]
      ],
      ["text-generation", [`Mon nom est Julien et j'aime`, `Mon nom est Thomas et mon principal`, `Il \xE9tait une fois`]],
      ["fill-mask", [`Paris est la <mask> de la France.`]],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "C'est une personne heureuse",
            sentences: [
              "C'est un chien heureux",
              "C'est une personne tr\xE8s heureuse",
              "Aujourd'hui est une journ\xE9e ensoleill\xE9e"
            ]
          }
        ]
      ]
    ]);
    var MAPPING_ES = /* @__PURE__ */ new Map([
      ["text-classification", [`Te quiero. Te amo.`]],
      ["token-classification", [`Me llamo Wolfgang y vivo en Berlin`]],
      [
        "question-answering",
        [
          {
            text: `\xBFD\xF3nde vivo?`,
            context: `Me llamo Wolfgang y vivo en Berlin`
          },
          {
            text: `\xBFQui\xE9n invent\xF3 el submarino?`,
            context: `Isaac Peral fue un murciano que invent\xF3 el submarino`
          },
          {
            text: `\xBFCu\xE1ntas personas hablan espa\xF1ol?`,
            context: `El espa\xF1ol es el segundo idioma m\xE1s hablado del mundo con m\xE1s de 442 millones de hablantes`
          }
        ]
      ],
      [
        "translation",
        [
          `Me llamo Wolfgang y vivo en Berlin`,
          `Los ingredientes de una tortilla de patatas son: huevos, patatas y cebolla`
        ]
      ],
      [
        "summarization",
        [
          `La torre tiene 324 metros (1.063 pies) de altura, aproximadamente la misma altura que un edificio de 81 pisos y la estructura m\xE1s alta de Par\xEDs. Su base es cuadrada, mide 125 metros (410 pies) a cada lado. Durante su construcci\xF3n, la Torre Eiffel super\xF3 al Washington Monument para convertirse en la estructura artificial m\xE1s alta del mundo, un t\xEDtulo que mantuvo durante 41 a\xF1os hasta que el Chrysler Building en la ciudad de Nueva York se termin\xF3 en 1930. Fue la primera estructura en llegar Una altura de 300 metros. Debido a la adici\xF3n de una antena de transmisi\xF3n en la parte superior de la torre en 1957, ahora es m\xE1s alta que el Chrysler Building en 5,2 metros (17 pies). Excluyendo los transmisores, la Torre Eiffel es la segunda estructura independiente m\xE1s alta de Francia despu\xE9s del Viaducto de Millau.`
        ]
      ],
      [
        "text-generation",
        [
          `Me llamo Julien y me gusta`,
          `Me llamo Thomas y mi principal`,
          `Me llamo Manuel y trabajo en`,
          `\xC9rase una vez,`,
          `Si t\xFA me dices ven, `
        ]
      ],
      ["fill-mask", [`Mi nombre es <mask> y vivo en Nueva York.`, `El espa\xF1ol es un idioma muy <mask> en el mundo.`]],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "Esa es una persona feliz",
            sentences: ["Ese es un perro feliz", "Esa es una persona muy feliz", "Hoy es un d\xEDa soleado"]
          }
        ]
      ]
    ]);
    var MAPPING_RU = /* @__PURE__ */ new Map([
      ["text-classification", [`\u0422\u044B \u043C\u043D\u0435 \u043D\u0440\u0430\u0432\u0438\u0448\u044C\u0441\u044F. \u042F \u0442\u0435\u0431\u044F \u043B\u044E\u0431\u043B\u044E`]],
      ["token-classification", [`\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 \u0412\u043E\u043B\u044C\u0444\u0433\u0430\u043D\u0433 \u0438 \u044F \u0436\u0438\u0432\u0443 \u0432 \u0411\u0435\u0440\u043B\u0438\u043D\u0435`]],
      [
        "question-answering",
        [
          {
            text: `\u0413\u0434\u0435 \u0436\u0438\u0432\u0443?`,
            context: `\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 \u0412\u043E\u043B\u044C\u0444\u0433\u0430\u043D\u0433 \u0438 \u044F \u0436\u0438\u0432\u0443 \u0432 \u0411\u0435\u0440\u043B\u0438\u043D\u0435`
          }
        ]
      ],
      ["translation", [`\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 \u0412\u043E\u043B\u044C\u0444\u0433\u0430\u043D\u0433 \u0438 \u044F \u0436\u0438\u0432\u0443 \u0432 \u0411\u0435\u0440\u043B\u0438\u043D\u0435`]],
      [
        "summarization",
        [
          `\u0412\u044B\u0441\u043E\u0442\u0430 \u0431\u0430\u0448\u043D\u0438 \u0441\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 324 \u043C\u0435\u0442\u0440\u0430 (1063 \u0444\u0443\u0442\u0430), \u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E \u0442\u0430\u043A\u0430\u044F \u0436\u0435 \u0432\u044B\u0441\u043E\u0442\u0430, \u043A\u0430\u043A \u0443 81-\u044D\u0442\u0430\u0436\u043D\u043E\u0433\u043E \u0437\u0434\u0430\u043D\u0438\u044F, \u0438 \u0441\u0430\u043C\u043E\u0435 \u0432\u044B\u0441\u043E\u043A\u043E\u0435 \u0441\u043E\u043E\u0440\u0443\u0436\u0435\u043D\u0438\u0435 \u0432 \u041F\u0430\u0440\u0438\u0436\u0435. \u0415\u0433\u043E \u043E\u0441\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u0432\u0430\u0434\u0440\u0430\u0442\u043D\u043E, \u0440\u0430\u0437\u043C\u0435\u0440\u043E\u043C 125 \u043C\u0435\u0442\u0440\u043E\u0432 (410 \u0444\u0443\u0442\u043E\u0432) \u0441 \u043B\u044E\u0431\u043E\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u044B. \u0412\u043E \u0432\u0440\u0435\u043C\u044F \u0441\u0442\u0440\u043E\u0438\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u0430 \u042D\u0439\u0444\u0435\u043B\u0435\u0432\u0430 \u0431\u0430\u0448\u043D\u044F \u043F\u0440\u0435\u0432\u0437\u043E\u0448\u043B\u0430 \u043C\u043E\u043D\u0443\u043C\u0435\u043D\u0442 \u0412\u0430\u0448\u0438\u043D\u0433\u0442\u043E\u043D\u0430, \u0441\u0442\u0430\u0432 \u0441\u0430\u043C\u044B\u043C \u0432\u044B\u0441\u043E\u043A\u0438\u043C \u0438\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u043C \u0441\u043E\u043E\u0440\u0443\u0436\u0435\u043D\u0438\u0435\u043C \u0432 \u043C\u0438\u0440\u0435, \u0438 \u044D\u0442\u043E\u0442 \u0442\u0438\u0442\u0443\u043B \u043E\u043D\u0430 \u0443\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u043B\u0430 \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 41 \u0433\u043E\u0434\u0430 \u0434\u043E \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u0441\u0442\u0440\u043E\u0438\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E \u0437\u0434\u0430\u043D\u0438\u044F \u041A\u0440\u0430\u0439\u0441\u043B\u0435\u0440 \u0432 \u041D\u044C\u044E-\u0419\u043E\u0440\u043A\u0435 \u0432 1930 \u0433\u043E\u0434\u0443. \u042D\u0442\u043E \u043F\u0435\u0440\u0432\u043E\u0435 \u0441\u043E\u043E\u0440\u0443\u0436\u0435\u043D\u0438\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0434\u043E\u0441\u0442\u0438\u0433\u043B\u043E \u0432\u044B\u0441\u043E\u0442\u044B 300 \u043C\u0435\u0442\u0440\u043E\u0432. \u0418\u0437-\u0437\u0430 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0432\u0435\u0449\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0439 \u0430\u043D\u0442\u0435\u043D\u043D\u044B \u043D\u0430 \u0432\u0435\u0440\u0448\u0438\u043D\u0435 \u0431\u0430\u0448\u043D\u0438 \u0432 1957 \u0433\u043E\u0434\u0443 \u043E\u043D\u0430 \u0441\u0435\u0439\u0447\u0430\u0441 \u0432\u044B\u0448\u0435 \u0437\u0434\u0430\u043D\u0438\u044F \u041A\u0440\u0430\u0439\u0441\u043B\u0435\u0440 \u043D\u0430 5,2 \u043C\u0435\u0442\u0440\u0430 (17 \u0444\u0443\u0442\u043E\u0432). \u0417\u0430 \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435\u043C \u043F\u0435\u0440\u0435\u0434\u0430\u0442\u0447\u0438\u043A\u043E\u0432, \u042D\u0439\u0444\u0435\u043B\u0435\u0432\u0430 \u0431\u0430\u0448\u043D\u044F \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432\u0442\u043E\u0440\u043E\u0439 \u0441\u0430\u043C\u043E\u0439 \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E \u0441\u0442\u043E\u044F\u0449\u0435\u0439 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u043E\u0439 \u0432\u043E \u0424\u0440\u0430\u043D\u0446\u0438\u0438 \u043F\u043E\u0441\u043B\u0435 \u0432\u0438\u0430\u0434\u0443\u043A\u0430 \u041C\u0438\u0439\u043E.`
        ]
      ],
      ["text-generation", [`\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 \u0416\u044E\u043B\u044C\u0435\u043D \u0438`, `\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 \u0422\u043E\u043C\u0430\u0441 \u0438 \u043C\u043E\u0439 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439`, `\u041E\u0434\u043D\u0430\u0436\u0434\u044B`]],
      ["fill-mask", [`\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 <mask> \u0438 \u044F \u0438\u043D\u0436\u0435\u043D\u0435\u0440 \u0436\u0438\u0432\u0443\u0449\u0438\u0439 \u0432 \u041D\u044C\u044E-\u0419\u043E\u0440\u043A\u0435.`]],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "\u042D\u0442\u043E \u0441\u0447\u0430\u0441\u0442\u043B\u0438\u0432\u044B\u0439 \u0447\u0435\u043B\u043E\u0432\u0435\u043A",
            sentences: ["\u042D\u0442\u043E \u0441\u0447\u0430\u0441\u0442\u043B\u0438\u0432\u0430\u044F \u0441\u043E\u0431\u0430\u043A\u0430", "\u042D\u0442\u043E \u043E\u0447\u0435\u043D\u044C \u0441\u0447\u0430\u0441\u0442\u043B\u0438\u0432\u044B\u0439 \u0447\u0435\u043B\u043E\u0432\u0435\u043A", "\u0421\u0435\u0433\u043E\u0434\u043D\u044F \u0441\u043E\u043B\u043D\u0435\u0447\u043D\u044B\u0439 \u0434\u0435\u043D\u044C"]
          }
        ]
      ]
    ]);
    var MAPPING_UK = /* @__PURE__ */ new Map([
      ["translation", [`\u041C\u0435\u043D\u0435 \u0437\u0432\u0430\u0442\u0438 \u0412\u043E\u043B\u044C\u0444\u0491\u0430\u043D\u0491 \u0456 \u044F \u0436\u0438\u0432\u0443 \u0432 \u0411\u0435\u0440\u043B\u0456\u043D\u0456.`]],
      ["fill-mask", [`\u041C\u0435\u043D\u0435 \u0437\u0432\u0430\u0442\u0438 <mask>.`]]
    ]);
    var MAPPING_IT = /* @__PURE__ */ new Map([
      ["text-classification", [`Mi piaci. Ti amo`]],
      [
        "token-classification",
        [
          `Mi chiamo Wolfgang e vivo a Berlino`,
          `Mi chiamo Sarah e vivo a Londra`,
          `Mi chiamo Clara e vivo a Berkeley in California.`
        ]
      ],
      [
        "question-answering",
        [
          {
            text: `Dove vivo?`,
            context: `Mi chiamo Wolfgang e vivo a Berlino`
          },
          {
            text: `Dove vivo?`,
            context: `Mi chiamo Sarah e vivo a Londra`
          },
          {
            text: `Come mio chiamo?`,
            context: `Mi chiamo Clara e vivo a Berkeley.`
          }
        ]
      ],
      ["translation", [`Mi chiamo Wolfgang e vivo a Berlino`, `Mi chiamo Sarah e vivo a Londra`]],
      [
        "summarization",
        [
          `La torre degli Asinelli \xE8 una delle cosiddette due torri di Bologna, simbolo della citt\xE0, situate in piazza di porta Ravegnana, all'incrocio tra le antiche strade San Donato (ora via Zamboni), San Vitale, Maggiore e Castiglione. Eretta, secondo la tradizione, fra il 1109 e il 1119 dal nobile Gherardo Asinelli, la torre \xE8 alta 97,20 metri, pende verso ovest per 2,23 metri e presenta all'interno una scalinata composta da 498 gradini. Ancora non si pu\xF2 dire con certezza quando e da chi fu costruita la torre degli Asinelli. Si presume che la torre debba il proprio nome a Gherardo Asinelli, il nobile cavaliere di fazione ghibellina al quale se ne attribuisce la costruzione, iniziata secondo una consolidata tradizione l'11 ottobre 1109 e terminata dieci anni dopo, nel 1119.`
        ]
      ],
      [
        "text-generation",
        [
          `Mi chiamo Loreto e mi piace`,
          `Mi chiamo Thomas e il mio principale`,
          `Mi chiamo Marianna, la mia cosa preferita`,
          `Mi chiamo Clara e sono`,
          `C'era una volta`
        ]
      ],
      ["fill-mask", [`Roma \xE8 la <mask> d'Italia.`, `Lo scopo della vita \xE8 <mask>.`]],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "Questa \xE8 una persona felice",
            sentences: ["Questo \xE8 un cane felice", "Questa \xE8 una persona molto felice", "Oggi \xE8 una giornata di sole"]
          }
        ]
      ]
    ]);
    var MAPPING_FA = /* @__PURE__ */ new Map([
      [
        "text-classification",
        [`\u067E\u0631\u0648\u0698\u0647 \u0628\u0647 \u0645\u0648\u0642\u0639 \u062A\u062D\u0648\u06CC\u0644 \u0634\u062F \u0648 \u0647\u0645\u0647 \u0686\u06CC\u0632 \u062E\u0648\u0628 \u0628\u0648\u062F.`, `\u0633\u06CC\u0628\u200C\u0632\u0645\u06CC\u0646\u06CC \u0628\u06CC\u200C\u06A9\u06CC\u0641\u06CC\u062A \u0628\u0648\u062F.`, `\u0642\u06CC\u0645\u062A \u0648 \u06A9\u06CC\u0641\u06CC\u062A \u0639\u0627\u0644\u06CC`, `\u062E\u0648\u0628 \u0646\u0628\u0648\u062F \u0627\u0635\u0644\u0627`]
      ],
      [
        "token-classification",
        [
          `\u0627\u06CC\u0646 \u0633\u0631\u06CC\u0627\u0644 \u0628\u0647 \u0635\u0648\u0631\u062A \u0631\u0633\u0645\u06CC \u062F\u0631 \u062A\u0627\u0631\u06CC\u062E \u062F\u0647\u0645 \u0645\u06CC \u06F2\u06F0\u06F1\u06F1 \u062A\u0648\u0633\u0637 \u0634\u0628\u06A9\u0647 \u0641\u0627\u06A9\u0633 \u0628\u0631\u0627\u06CC \u067E\u062E\u0634 \u0631\u0632\u0631\u0648 \u0634\u062F.`,
          `\u062F\u0641\u062A\u0631 \u0645\u0631\u06A9\u0632\u06CC \u0634\u0631\u06A9\u062A \u067E\u0627\u0631\u0633\u200C\u0645\u06CC\u0646\u0648 \u062F\u0631 \u0634\u0647\u0631 \u0627\u0631\u0627\u06A9 \u062F\u0631 \u0627\u0633\u062A\u0627\u0646 \u0645\u0631\u06A9\u0632\u06CC \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F.`,
          `\u0648\u06CC \u062F\u0631 \u0633\u0627\u0644 \u06F2\u06F0\u06F1\u06F3 \u062F\u0631\u06AF\u0630\u0634\u062A \u0648 \u0645\u0633\u0626\u0648\u0644 \u062E\u0627\u06A9\u0633\u067E\u0627\u0631\u06CC \u0648 \u0627\u0642\u0648\u0627\u0645\u0634 \u0628\u0631\u0627\u06CC \u0627\u0648 \u0645\u0631\u0627\u0633\u0645 \u06CC\u0627\u062F\u0628\u0648\u062F \u06AF\u0631\u0641\u062A\u0646\u062F.`
        ]
      ],
      [
        "question-answering",
        [
          {
            text: `\u0645\u0646 \u06A9\u062C\u0627 \u0632\u0646\u062F\u06AF\u06CC \u0645\u06CC\u06A9\u0646\u0645\u061F`,
            context: `\u0646\u0627\u0645 \u0645\u0646 \u067E\u0698\u0645\u0627\u0646 \u0627\u0633\u062A \u0648 \u062F\u0631 \u06AF\u0631\u06AF\u0627\u0646 \u0632\u0646\u062F\u06AF\u06CC \u0645\u06CC\u06A9\u0646\u0645.`
          },
          {
            text: `\u0646\u0627\u0645\u0645 \u0686\u06CC\u0633\u062A \u0648 \u06A9\u062C\u0627 \u0632\u0646\u062F\u06AF\u06CC \u0645\u06CC\u200C\u06A9\u0646\u0645\u061F`,
            context: `\u0627\u0633\u0645\u0645 \u0633\u0627\u0631\u0627 \u0627\u0633\u062A \u0648 \u062F\u0631 \u0622\u0641\u0631\u06CC\u0642\u0627\u06CC \u062C\u0646\u0648\u0628\u06CC \u0632\u0646\u062F\u06AF\u06CC \u0645\u06CC\u06A9\u0646\u0645.`
          },
          {
            text: `\u0646\u0627\u0645 \u0645\u0646 \u0686\u06CC\u0633\u062A\u061F`,
            context: `\u0645\u0646 \u0645\u0631\u06CC\u0645 \u0647\u0633\u062A\u0645 \u0648 \u062F\u0631 \u062A\u0628\u0631\u06CC\u0632 \u0632\u0646\u062F\u06AF\u06CC \u0645\u06CC\u200C\u06A9\u0646\u0645.`
          },
          {
            text: `\u0628\u06CC\u0634\u062A\u0631\u06CC\u0646 \u0645\u0633\u0627\u062D\u062A \u062C\u0646\u06AF\u0644 \u0622\u0645\u0627\u0632\u0648\u0646 \u062F\u0631 \u06A9\u062F\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0627\u0633\u062A\u061F`,
            context: [
              "\u0622\u0645\u0627\u0632\u0648\u0646 \u0646\u0627\u0645 \u0628\u0632\u0631\u06AF\u200C\u062A\u0631\u06CC\u0646 \u062C\u0646\u06AF\u0644 \u0628\u0627\u0631\u0627\u0646\u06CC \u062C\u0647\u0627\u0646 \u0627\u0633\u062A \u06A9\u0647 \u062F\u0631 \u0634\u0645\u0627\u0644 \u0622\u0645\u0631\u06CC\u06A9\u0627\u06CC \u062C\u0646\u0648\u0628\u06CC \u0642\u0631\u0627\u0631 \u06AF\u0631\u0641\u062A\u0647 \u0648 \u0628\u06CC\u0634\u062A\u0631 \u0622\u0646 \u062F\u0631 \u062E\u0627\u06A9 \u0628\u0631\u0632\u06CC\u0644 \u0648 \u067E\u0631\u0648",
              "\u062C\u0627\u06CC \u062F\u0627\u0631\u062F. \u0628\u06CC\u0634 \u0627\u0632 \u0646\u06CC\u0645\u06CC \u0627\u0632 \u0647\u0645\u0647 \u062C\u0646\u06AF\u0644\u200C\u0647\u0627\u06CC \u0628\u0627\u0631\u0627\u0646\u06CC \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647 \u062F\u0631 \u062C\u0647\u0627\u0646 \u062F\u0631 \u0622\u0645\u0627\u0632\u0648\u0646 \u0642\u0631\u0627\u0631 \u062F\u0627\u0631\u062F.",
              "\u0645\u0633\u0627\u062D\u062A \u062C\u0646\u06AF\u0644\u200C\u0647\u0627\u06CC \u0622\u0645\u0627\u0632\u0648\u0646 \u06F5\u066B\u06F5 \u0645\u06CC\u0644\u06CC\u0648\u0646 \u06A9\u06CC\u0644\u0648\u0645\u062A\u0631 \u0645\u0631\u0628\u0639 \u0627\u0633\u062A \u06A9\u0647 \u0628\u06CC\u0646 \u06F9 \u06A9\u0634\u0648\u0631 \u062A\u0642\u0633\u06CC\u0645 \u0634\u062F\u0647\u200C\u0627\u0633\u062A."
            ].join("\n")
          }
        ]
      ],
      [
        "translation",
        [
          "\u0628\u06CC\u0634\u062A\u0631 \u0645\u0633\u0627\u062D\u062A \u062C\u0646\u06AF\u0644\u200C\u0647\u0627\u06CC \u0622\u0645\u0627\u0632\u0648\u0646 \u062F\u0631 \u062D\u0648\u0636\u0647 \u0622\u0628\u0631\u06CC\u0632 \u0631\u0648\u062F \u0622\u0645\u0627\u0632\u0648\u0646 \u0648 \u06F1\u06F1\u06F0\u06F0 \u0634\u0627\u062E\u0647 \u0622\u0646 \u0648\u0627\u0642\u0639 \u0634\u062F\u0647\u200C\u0627\u0633\u062A.",
          "\u0645\u0631\u062F\u0645\u0627\u0646 \u0646\u064E\u0628\u064E\u0637\u06CC \u0627\u0632 \u0647\u0632\u0627\u0631\u0647\u200C\u0647\u0627\u06CC \u06CC\u06A9\u0645 \u0648 \u062F\u0648\u0645 \u067E\u06CC\u0634 \u0627\u0632 \u0645\u06CC\u0644\u0627\u062F \u062F\u0631 \u0627\u06CC\u0646 \u0645\u0646\u0637\u0642\u0647 \u0632\u0646\u062F\u06AF\u06CC \u0645\u06CC\u200C\u06A9\u0631\u062F\u0646\u062F."
        ]
      ],
      [
        "summarization",
        [
          [
            "\u0634\u0627\u0647\u0646\u0627\u0645\u0647 \u0627\u062B\u0631 \u062D\u06A9\u06CC\u0645 \u0627\u0628\u0648\u0627\u0644\u0642\u0627\u0633\u0645 \u0641\u0631\u062F\u0648\u0633\u06CC \u062A\u0648\u0633\u06CC\u060C \u062D\u0645\u0627\u0633\u0647\u200C\u0627\u06CC \u0645\u0646\u0638\u0648\u0645\u060C \u0628\u0631 \u062D\u0633\u0628 \u062F\u0633\u062A \u0646\u0648\u0634\u062A\u0647\u200C\u0647\u0627\u06CC ",
            "\u0645\u0648\u062C\u0648\u062F \u062F\u0631\u0628\u0631\u06AF\u06CC\u0631\u0646\u062F\u0647 \u0646\u0632\u062F\u06CC\u06A9 \u0628\u0647 \u06F5\u06F0\u066C\u06F0\u06F0\u06F0 \u0628\u06CC\u062A \u062A\u0627 \u0646\u0632\u062F\u06CC\u06A9 \u0628\u0647 \u06F6\u06F1\u066C\u06F0\u06F0\u06F0 \u0628\u06CC\u062A \u0648 \u06CC\u06A9\u06CC \u0627\u0632 ",
            "\u0628\u0632\u0631\u06AF\u200C\u062A\u0631\u06CC\u0646 \u0648 \u0628\u0631\u062C\u0633\u062A\u0647\u200C\u062A\u0631\u06CC\u0646 \u0633\u0631\u0648\u062F\u0647\u200C\u0647\u0627\u06CC \u062D\u0645\u0627\u0633\u06CC \u062C\u0647\u0627\u0646 \u0627\u0633\u062A \u06A9\u0647 \u0633\u0631\u0627\u06CC\u0634 \u0622\u0646 \u062F\u0633\u062A\u200C\u0622\u0648\u0631\u062F\u0650 ",
            "\u062F\u0633\u062A\u200C\u06A9\u0645 \u0633\u06CC \u0633\u0627\u0644 \u06A9\u0627\u0631\u0650 \u067E\u06CC\u0648\u0633\u062A\u0647\u0654 \u0627\u06CC\u0646 \u0633\u062E\u0646\u200C\u0633\u0631\u0627\u06CC \u0646\u0627\u0645\u062F\u0627\u0631 \u0627\u06CC\u0631\u0627\u0646\u06CC \u0627\u0633\u062A. \u0645\u0648\u0636\u0648\u0639 \u0627\u06CC\u0646 \u0634\u0627\u0647\u06A9\u0627\u0631 \u0627\u062F\u0628\u06CC\u060C",
            " \u0627\u0641\u0633\u0627\u0646\u0647\u200C\u0647\u0627 \u0648 \u062A\u0627\u0631\u06CC\u062E \u0627\u06CC\u0631\u0627\u0646 \u0627\u0632 \u0622\u063A\u0627\u0632 \u062A\u0627 \u062D\u0645\u0644\u0647\u0654 \u0639\u0631\u0628\u200C\u0647\u0627 \u0628\u0647 \u0627\u06CC\u0631\u0627\u0646 \u062F\u0631 \u0633\u062F\u0647\u0654 \u0647\u0641\u062A\u0645 \u0645\u06CC\u0644\u0627\u062F\u06CC \u0627\u0633\u062A",
            "  (\u0634\u0627\u0647\u0646\u0627\u0645\u0647 \u0627\u0632 \u0633\u0647 \u0628\u062E\u0634 \u0627\u0633\u0637\u0648\u0631\u0647\u060C \u067E\u0647\u0644\u0648\u0627\u0646\u06CC \u0648 \u062A\u0627\u0631\u06CC\u062E\u06CC \u062A\u0634\u06A9\u06CC\u0644 \u0634\u062F\u0647\u200C\u0627\u0633\u062A) \u06A9\u0647 \u062F\u0631 \u0686\u0647\u0627\u0631",
            "   \u062F\u0648\u062F\u0645\u0627\u0646 \u067E\u0627\u062F\u0634\u0627\u0647\u06CC\u0650 \u067E\u06CC\u0634\u062F\u0627\u062F\u06CC\u0627\u0646\u060C \u06A9\u06CC\u0627\u0646\u06CC\u0627\u0646\u060C \u0627\u0634\u06A9\u0627\u0646\u06CC\u0627\u0646 \u0648 \u0633\u0627\u0633\u0627\u0646\u06CC\u0627\u0646 \u06AF\u0646\u062C\u0627\u0646\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
            "    \u0634\u0627\u0647\u0646\u0627\u0645\u0647 \u0628\u0631 \u0648\u0632\u0646 \xAB\u0641\u064E\u0639\u0648\u0644\u064F\u0646 \u0641\u0639\u0648\u0644\u0646 \u0641\u0639\u0648\u0644\u0646 \u0641\u064E\u0639\u064E\u0644\u0652\xBB\u060C \u062F\u0631 \u0628\u062D\u0631\u0650 \u0645\u064F\u062A\u064E\u0642\u0627\u0631\u0650\u0628\u0650 \u0645\u062B\u0645\u064E\u0651\u0646\u0650 \u0645\u062D\u0630\u0648\u0641 \u0646\u06AF\u0627\u0634\u062A\u0647 \u0634\u062F\u0647\u200C\u0627\u0633\u062A.",
            "\u0647\u0646\u06AF\u0627\u0645\u06CC \u06A9\u0647 \u0632\u0628\u0627\u0646 \u062F\u0627\u0646\u0634 \u0648 \u0627\u062F\u0628\u06CC\u0627\u062A \u062F\u0631 \u0627\u06CC\u0631\u0627\u0646 \u0632\u0628\u0627\u0646 \u0639\u0631\u0628\u06CC \u0628\u0648\u062F\u060C \u0641\u0631\u062F\u0648\u0633\u06CC\u060C \u0628\u0627 \u0633\u0631\u0648\u062F\u0646 \u0634\u0627\u0647\u0646\u0627\u0645\u0647",
            " \u0628\u0627 \u0648\u06CC\u0698\u06AF\u06CC\u200C\u0647\u0627\u06CC \u0647\u062F\u0641\u200C\u0645\u0646\u062F\u06CC \u06A9\u0647 \u062F\u0627\u0634\u062A\u060C \u0632\u0628\u0627\u0646 \u067E\u0627\u0631\u0633\u06CC \u0631\u0627 \u0632\u0646\u062F\u0647 \u0648 \u067E\u0627\u06CC\u062F\u0627\u0631 \u06A9\u0631\u062F. \u06CC\u06A9\u06CC \u0627\u0632 ",
            " \u0628\u0646\u200C\u0645\u0627\u06CC\u0647\u200C\u0647\u0627\u06CC \u0645\u0647\u0645\u06CC \u06A9\u0647 \u0641\u0631\u062F\u0648\u0633\u06CC \u0628\u0631\u0627\u06CC \u0633\u0631\u0648\u062F\u0646 \u0634\u0627\u0647\u0646\u0627\u0645\u0647 \u0627\u0632 \u0622\u0646 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0631\u062F\u060C",
            "  \u0634\u0627\u0647\u0646\u0627\u0645\u0647\u0654 \u0627\u0628\u0648\u0645\u0646\u0635\u0648\u0631\u06CC \u0628\u0648\u062F. \u0634\u0627\u0647\u0646\u0627\u0645\u0647 \u0646\u0641\u0648\u0630 \u0628\u0633\u06CC\u0627\u0631\u06CC \u062F\u0631 \u062C\u0647\u062A\u200C\u06AF\u06CC\u0631\u06CC ",
            "  \u0641\u0631\u0647\u0646\u06AF \u0641\u0627\u0631\u0633\u06CC \u0648 \u0646\u06CC\u0632 \u0628\u0627\u0632\u062A\u0627\u0628\u200C\u0647\u0627\u06CC \u0634\u06A9\u0648\u0647\u200C\u0645\u0646\u062F\u06CC \u062F\u0631 \u0627\u062F\u0628\u06CC\u0627\u062A \u062C\u0647\u0627\u0646 \u062F\u0627\u0634\u062A\u0647\u200C\u0627\u0633\u062A \u0648 \u0634\u0627\u0639\u0631\u0627\u0646 ",
            "  \u0628\u0632\u0631\u06AF\u06CC \u0645\u0627\u0646\u0646\u062F \u06AF\u0648\u062A\u0647 \u0648 \u0648\u06CC\u06A9\u062A\u0648\u0631 \u0647\u0648\u06AF\u0648 \u0627\u0632 \u0622\u0646 \u0628\u0647 \u0646\u06CC\u06A9\u06CC \u06CC\u0627\u062F \u06A9\u0631\u062F\u0647\u200C\u0627\u0646\u062F."
          ].join("\n")
        ]
      ],
      ["text-generation", ["\u0627\u0633\u0645 \u0645\u0646 \u0646\u0627\u0632\u0646\u06CC\u0646 \u0627\u0633\u062A \u0648 \u0645\u0646", "\u0631\u0648\u0632\u06CC \u0631\u0648\u0632\u06AF\u0627\u0631\u06CC"]],
      [
        "fill-mask",
        [
          `\u0632\u0646\u062F\u06AF\u06CC \u06CC\u06A9 \u0633\u0648\u0627\u0644 \u0627\u0633\u062A \u0648 \u0627\u06CC\u0646 \u06A9\u0647 \u0686\u06AF\u0648\u0646\u0647 <mask> \u06A9\u0646\u06CC\u0645 \u067E\u0627\u0633\u062E \u0627\u06CC\u0646 \u0633\u0648\u0627\u0644!`,
          `\u0632\u0646\u062F\u06AF\u06CC \u0627\u0632 \u0645\u0631\u06AF \u067E\u0631\u0633\u06CC\u062F: \u0686\u0631\u0627 \u0647\u0645\u0647 \u0645\u0646 \u0631\u0627 <mask> \u062F\u0627\u0631\u0646\u062F \u0627\u0645\u0627 \u0627\u0632 \u062A\u0648 \u0645\u062A\u0646\u0641\u0631\u0646\u062F\u061F`
        ]
      ]
    ]);
    var MAPPING_AR = /* @__PURE__ */ new Map([
      ["text-classification", [`\u0623\u062D\u0628\u0643. \u0623\u0647\u0648\u0627\u0643`]],
      [
        "token-classification",
        [`\u0625\u0633\u0645\u064A \u0645\u062D\u0645\u062F \u0648\u0623\u0633\u0643\u0646 \u0641\u064A \u0628\u0631\u0644\u064A\u0646`, `\u0625\u0633\u0645\u064A \u0633\u0627\u0631\u0647 \u0648\u0623\u0633\u0643\u0646 \u0641\u064A \u0644\u0646\u062F\u0646`, `\u0625\u0633\u0645\u064A \u0633\u0627\u0645\u064A \u0648\u0623\u0633\u0643\u0646 \u0641\u064A \u0627\u0644\u0642\u062F\u0633 \u0641\u064A \u0641\u0644\u0633\u0637\u064A\u0646.`]
      ],
      [
        "question-answering",
        [
          {
            text: `\u0623\u064A\u0646 \u0623\u0633\u0643\u0646\u061F`,
            context: `\u0625\u0633\u0645\u064A \u0645\u062D\u0645\u062F \u0648\u0623\u0633\u0643\u0646 \u0641\u064A \u0628\u064A\u0631\u0648\u062A`
          },
          {
            text: `\u0623\u064A\u0646 \u0623\u0633\u0643\u0646\u061F`,
            context: `\u0625\u0633\u0645\u064A \u0633\u0627\u0631\u0647 \u0648\u0623\u0633\u0643\u0646 \u0641\u064A \u0644\u0646\u062F\u0646`
          },
          {
            text: `\u0645\u0627 \u0627\u0633\u0645\u064A\u061F`,
            context: `\u0627\u0633\u0645\u064A \u0633\u0639\u064A\u062F \u0648\u0623\u0633\u0643\u0646 \u0641\u064A \u062D\u064A\u0641\u0627.`
          },
          {
            text: `\u0645\u0627 \u0644\u0642\u0628 \u062E\u0627\u0644\u062F \u0628\u0646 \u0627\u0644\u0648\u0644\u064A\u062F \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629\u061F`,
            context: `\u062E\u0627\u0644\u062F \u0628\u0646 \u0627\u0644\u0648\u0644\u064A\u062F \u0645\u0646 \u0623\u0628\u0637\u0627\u0644 \u0648\u0642\u0627\u062F\u0629 \u0627\u0644\u0641\u062A\u062D \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064A \u0648\u0642\u062F \u062A\u062D\u062F\u062B\u062A \u0639\u0646\u0647 \u0627\u0644\u0644\u063A\u0627\u062A \u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0648\u0627\u0644\u0641\u0631\u0646\u0633\u064A\u0629 \u0648\u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064A\u0629 \u0648\u0644\u0642\u0628 \u0628\u0633\u064A\u0641 \u0627\u0644\u0644\u0647 \u0627\u0644\u0645\u0633\u0644\u0648\u0644.`
          }
        ]
      ],
      ["translation", [`\u0625\u0633\u0645\u064A \u0645\u062D\u0645\u062F \u0648\u0623\u0633\u0643\u0646 \u0641\u064A \u0628\u0631\u0644\u064A\u0646`, `\u0625\u0633\u0645\u064A \u0633\u0627\u0631\u0647 \u0648\u0623\u0633\u0643\u0646 \u0641\u064A \u0644\u0646\u062F\u0646`]],
      [
        "summarization",
        [
          `\u062A\u0642\u0639 \u0627\u0644\u0623\u0647\u0631\u0627\u0645\u0627\u062A \u0641\u064A \u0627\u0644\u062C\u064A\u0632\u0629 \u0642\u0631\u0628 \u0627\u0644\u0642\u0627\u0647\u0631\u0629 \u0641\u064A \u0645\u0635\u0631 \u0648\u0642\u062F \u0628\u0646\u064A\u062A \u0645\u0646\u0630 \u0639\u062F\u0629 \u0642\u0631\u0648\u0646\u060C \u0648\u0642\u064A\u0644 \u0625\u0646\u0647\u0627 \u0643\u0627\u0646\u062A \u0642\u0628\u0648\u0631\u0627 \u0644\u0644\u0641\u0631\u0627\u0639\u0646\u0629 \u0648\u062A\u0645 \u0628\u0646\u0627\u0624\u0647\u0627 \u0628\u0639\u0645\u0644\u064A\u0629 \u0647\u0646\u062F\u0633\u064A\u0629 \u0631\u0627\u0626\u0639\u0629 \u0648\u0627\u0633\u062A\u0642\u062F\u0645\u062A \u062D\u062C\u0627\u0631\u062A\u0647\u0627 \u0645\u0646 \u062C\u0628\u0644 \u0627\u0644\u0645\u0642\u0637\u0645 \u0648\u062A\u0645 \u0646\u0642\u0644\u0647\u0627 \u0628\u0627\u0644\u0633\u0641\u0646 \u0623\u0648 \u0639\u0644\u0649 \u0627\u0644\u0631\u0645\u0644\u060C \u0648\u0645\u0627 \u062A\u0632\u0627\u0644 \u0634\u0627\u0645\u062E\u0629 \u0648\u064A\u0642\u0635\u062F\u0647\u0627 \u0627\u0644\u0633\u064A\u0627\u062D \u0645\u0646 \u0643\u0627\u0641\u0629 \u0623\u0631\u062C\u0627\u0621 \u0627\u0644\u0645\u0639\u0645\u0648\u0631\u0629.`
        ]
      ],
      [
        "text-generation",
        [
          `\u0625\u0633\u0645\u064A \u0645\u062D\u0645\u062F \u0648\u0623\u062D\u0628 \u0623\u0646`,
          `\u062F\u0639 \u0627\u0644\u0645\u0643\u0627\u0631\u0645 \u0644\u0627 \u062A\u0631\u062D\u0644 \u0644\u0628\u063A\u064A\u062A\u0647\u0627 - \u0648\u0627\u0642\u0639\u062F \u0641\u0625\u0646\u0643 \u0623\u0646\u062A \u0627\u0644\u0637\u0627\u0639\u0645 \u0627\u0644\u0643\u0627\u0633\u064A.`,
          `\u0644\u0645\u0627\u0630\u0627 \u0646\u062D\u0646 \u0647\u0646\u0627\u061F`,
          `\u0627\u0644\u0642\u062F\u0633 \u0645\u062F\u064A\u0646\u0629 \u062A\u0627\u0631\u064A\u062E\u064A\u0629\u060C \u0628\u0646\u0627\u0647\u0627 \u0627\u0644\u0643\u0646\u0639\u0627\u0646\u064A\u0648\u0646 \u0641\u064A`,
          `\u0643\u0627\u0646 \u064A\u0627 \u0645\u0627 \u0643\u0627\u0646 \u0641\u064A \u0642\u062F\u064A\u0645 \u0627\u0644\u0632\u0645\u0627\u0646`
        ]
      ],
      ["fill-mask", [`\u0628\u0627\u0631\u064A\u0633 <mask> \u0641\u0631\u0646\u0633\u0627.`, `\u0641\u0644\u0633\u0641\u0629 \u0627\u0644\u062D\u064A\u0627\u0629 \u0647\u064A <mask>.`]],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "\u0647\u0630\u0627 \u0634\u062E\u0635 \u0633\u0639\u064A\u062F",
            sentences: ["\u0647\u0630\u0627 \u0643\u0644\u0628 \u0633\u0639\u064A\u062F", "\u0647\u0630\u0627 \u0634\u062E\u0635 \u0633\u0639\u064A\u062F \u062C\u062F\u0627", "\u0627\u0644\u064A\u0648\u0645 \u0647\u0648 \u064A\u0648\u0645 \u0645\u0634\u0645\u0633"]
          }
        ]
      ]
    ]);
    var MAPPING_BN = /* @__PURE__ */ new Map([
      ["text-classification", [`\u09AC\u09BE\u0999\u09BE\u09B2\u09BF\u09B0 \u0998\u09B0\u09C7 \u0998\u09B0\u09C7 \u0986\u099C \u09A8\u09AC\u09BE\u09A8\u09CD\u09A8 \u0989\u09CE\u09B8\u09AC\u0964`]],
      [
        "token-classification",
        [`\u0986\u09AE\u09BE\u09B0 \u09A8\u09BE\u09AE \u099C\u09BE\u09B9\u09BF\u09A6 \u098F\u09AC\u0982 \u0986\u09AE\u09BF \u09A2\u09BE\u0995\u09BE\u09DF \u09AC\u09BE\u09B8 \u0995\u09B0\u09BF\u0964`, `\u09A4\u09BF\u09A8\u09BF \u0997\u09C1\u0997\u09B2\u09C7 \u099A\u09BE\u0995\u09B0\u09C0 \u0995\u09B0\u09C7\u09A8\u0964`, `\u0986\u09AE\u09BE\u09B0 \u09A8\u09BE\u09AE \u09B8\u09C1\u09B8\u09CD\u09AE\u09BF\u09A4\u09BE \u098F\u09AC\u0982 \u0986\u09AE\u09BF \u0995\u09B2\u0995\u09BE\u09A4\u09BE\u09DF \u09AC\u09BE\u09B8 \u0995\u09B0\u09BF\u0964`]
      ],
      ["translation", [`\u0986\u09AE\u09BE\u09B0 \u09A8\u09BE\u09AE \u099C\u09BE\u09B9\u09BF\u09A6, \u0986\u09AE\u09BF \u09B0\u0982\u09AA\u09C1\u09B0\u09C7 \u09AC\u09BE\u09B8 \u0995\u09B0\u09BF\u0964`, `\u0986\u09AA\u09A8\u09BF \u0995\u09C0 \u0986\u099C\u0995\u09C7 \u09AC\u09BE\u09B8\u09BE\u09DF \u0986\u09B8\u09AC\u09C7\u09A8?`]],
      [
        "summarization",
        [
          `\u2018\u0987\u0995\u09CB\u09A8\u09AE\u09BF\u09B8\u09CD\u099F\u2019 \u09B2\u09BF\u0996\u09C7\u099B\u09C7, \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09A1\u09BF\u09B0 \u099A\u09BE\u09B0 \u09AE\u09BE\u09B8 \u09B8\u09CD\u09A5\u09BE\u09DF\u09C0 \u09B9\u0993\u09DF\u09BE\u09B0 \u0996\u09AC\u09B0\u099F\u09BF \u09A6\u09C1\u0987 \u0995\u09BE\u09B0\u09A3\u09C7 \u0986\u09A8\u09A8\u09CD\u09A6\u09C7\u09B0\u0964 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09A1\u09BF \u09AF\u09A4 \u09A6\u09BF\u09A8 \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4 \u09B6\u09B0\u09C0\u09B0\u09C7 \u099F\u09BF\u0995\u09AC\u09C7, \u09A4\u09A4 \u09A6\u09BF\u09A8 \u09B8\u0982\u0995\u09CD\u09B0\u09AE\u09A3 \u09A5\u09C7\u0995\u09C7 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u09A5\u09BE\u0995\u09BE \u09B8\u09AE\u09CD\u09AD\u09AC\u0964 \u0985\u09B0\u09CD\u09A5\u09BE\u09CE, \u098F\u09AE\u09A8 \u098F\u0995 \u099F\u09BF\u0995\u09BE\u09B0 \u09AA\u09CD\u09B0\u09DF\u09CB\u099C\u09A8 \u09B9\u09AC\u09C7, \u09AF\u09BE \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09A1\u09BF\u09B0 \u0989\u09A4\u09CD\u09AA\u09BE\u09A6\u09A8\u0995\u09C7 \u09AA\u09CD\u09B0\u09B0\u09CB\u099A\u09BF\u09A4 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7 \u098F\u09AC\u0982 \u09A6\u09C0\u09B0\u09CD\u0998\u09B8\u09CD\u09A5\u09BE\u09DF\u09C0 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE \u09A6\u09BF\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964 \u098F\u0997\u09C1\u09B2\u09CB \u0996\u09C1\u0981\u099C\u09C7 \u09AC\u09C7\u09B0 \u0995\u09B0\u09BE\u0993 \u09B8\u09B9\u099C\u0964 \u098F\u099F\u09BF \u0986\u09AD\u09BE\u09B8 \u09A6\u09C7\u09DF, \u09AC\u09CD\u09AF\u09BE\u09AA\u0995 \u09B9\u09BE\u09B0\u09C7 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09A1\u09BF \u09B6\u09A8\u09BE\u0995\u09CD\u09A4\u0995\u09B0\u09A3 \u09AB\u09B2\u09BE\u09AB\u09B2 \u09AE\u09CB\u099F\u09BE\u09AE\u09C1\u099F\u09BF \u09A8\u09BF\u09B0\u09CD\u09AD\u09C1\u09B2 \u09B9\u0993\u09DF\u09BE \u0989\u099A\u09BF\u09A4\u0964 \u09A6\u09CD\u09AC\u09BF\u09A4\u09C0\u09DF \u0986\u09B0\u09C7\u0995\u099F\u09BF \u0997\u09AC\u09C7\u09B7\u09A3\u09BE\u09B0 \u09A8\u09C7\u09A4\u09C3\u09A4\u09CD\u09AC \u09A6\u09BF\u09DF\u09C7\u099B\u09C7\u09A8 \u09AF\u09C1\u0995\u09CD\u09A4\u09B0\u09BE\u099C\u09CD\u09AF\u09C7\u09B0 \u09AE\u09C7\u09A1\u09BF\u0995\u09C7\u09B2 \u09B0\u09BF\u09B8\u09BE\u09B0\u09CD\u099A \u0995\u09BE\u0989\u09A8\u09CD\u09B8\u09BF\u09B2\u09C7\u09B0 (\u098F\u09AE\u0986\u09B0\u09B8\u09BF) \u0987\u09AE\u09BF\u0989\u09A8\u09CB\u09B2\u099C\u09BF\u09B8\u09CD\u099F \u09A4\u09BE\u0993 \u09A6\u0982\u0964 \u09A4\u09BF\u09A8\u09BF \u099F\u09BF-\u09B8\u09C7\u09B2 \u09B6\u09A8\u09BE\u0995\u09CD\u09A4\u0995\u09B0\u09A3\u09C7 \u0995\u09BE\u099C \u0995\u09B0\u09C7\u099B\u09C7\u09A8\u0964 \u099F\u09BF-\u09B8\u09C7\u09B2 \u09B6\u09A8\u09BE\u0995\u09CD\u09A4\u0995\u09B0\u09A3\u09C7\u09B0 \u09AA\u09CD\u09B0\u0995\u09CD\u09B0\u09BF\u09DF\u09BE \u0985\u09AC\u09B6\u09CD\u09AF \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u099F\u09BF\u09AC\u09A1\u09BF\u09B0 \u09AE\u09A4\u09CB \u098F\u09A4 \u0986\u09B2\u09CB\u099A\u09BF\u09A4 \u09A8\u09DF\u0964 \u09A4\u09AC\u09C7 \u09B8\u0982\u0995\u09CD\u09B0\u09AE\u09A3\u09C7\u09B0 \u09AC\u09BF\u09B0\u09C1\u09A6\u09CD\u09A7\u09C7 \u09B2\u09DC\u09BE\u0987 \u098F\u09AC\u0982 \u09A6\u09C0\u09B0\u09CD\u0998\u09AE\u09C7\u09DF\u09BE\u09A6\u09BF \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE\u09DF \u09B8\u09AE\u09BE\u09A8 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AD\u09C2\u09AE\u09BF\u0995\u09BE \u09AA\u09BE\u09B2\u09A8 \u0995\u09B0\u09C7\u0964 \u0997\u09AC\u09C7\u09B7\u09A3\u09BE\u09B8\u0982\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7 \u09AA\u09CD\u09B0\u0995\u09BE\u09B6\u09BF\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7 \u2018\u09A8\u09C7\u099A\u09BE\u09B0 \u0987\u09AE\u09BF\u0989\u09A8\u09CB\u09B2\u099C\u09BF\u2019 \u09B8\u09BE\u09AE\u09DF\u09BF\u0995\u09C0\u09A4\u09C7\u0964 \u09A4\u09BE\u0981\u09B0\u09BE \u09AC\u09B2\u099B\u09C7\u09A8, \u0997\u09AC\u09C7\u09B7\u09A3\u09BE\u09B0 \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u0995\u09CB\u09AD\u09BF\u09A1-\u09E7\u09EF \u09AE\u09C3\u09A6\u09C1 \u09B8\u0982\u0995\u09CD\u09B0\u09AE\u09A3\u09C7\u09B0 \u09B6\u09BF\u0995\u09BE\u09B0 \u09E8\u09EE \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u09B0 \u09B0\u0995\u09CD\u09A4\u09C7\u09B0 \u09A8\u09AE\u09C1\u09A8\u09BE, \u09E7\u09EA \u099C\u09A8 \u0997\u09C1\u09B0\u09C1\u09A4\u09B0 \u0985\u09B8\u09C1\u09B8\u09CD\u09A5 \u0993 \u09E7\u09EC \u099C\u09A8 \u09B8\u09C1\u09B8\u09CD\u09A5 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u09B0 \u09B0\u0995\u09CD\u09A4\u09C7\u09B0 \u09A8\u09AE\u09C1\u09A8\u09BE \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u09C7\u099B\u09C7\u09A8\u0964 \u0997\u09AC\u09C7\u09B7\u09A3\u09BE \u09A8\u09BF\u09AC\u09A8\u09CD\u09A7\u09C7 \u09AC\u09B2\u09BE \u09B9\u09DF, \u09B8\u0982\u0995\u09CD\u09B0\u09AE\u09BF\u09A4 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u09A6\u09C7\u09B0 \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u099F\u09BF-\u09B8\u09C7\u09B2\u09C7\u09B0 \u09A4\u09C0\u09AC\u09CD\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u0995\u09CD\u09B0\u09BF\u09DF\u09BE \u09A4\u09BE\u0981\u09B0\u09BE \u09A6\u09C7\u0996\u09C7\u099B\u09C7\u09A8\u0964 \u098F \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u09AE\u09C3\u09A6\u09C1 \u0993 \u0997\u09C1\u09B0\u09C1\u09A4\u09B0 \u0985\u09B8\u09C1\u09B8\u09CD\u09A5 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF\u09A6\u09C7\u09B0 \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09C7 \u09AA\u09CD\u09B0\u09A4\u09BF\u0995\u09CD\u09B0\u09BF\u09DF\u09BE\u09B0 \u09AD\u09BF\u09A8\u09CD\u09A8\u09A4\u09BE \u09AA\u09BE\u0993\u09DF\u09BE \u0997\u09C7\u099B\u09C7\u0964`
        ]
      ],
      ["text-generation", [`\u0986\u09AE\u09BF \u09B0\u09A4\u09A8 \u098F\u09AC\u0982 \u0986\u09AE\u09BF`, `\u09A4\u09C1\u09AE\u09BF \u09AF\u09A6\u09BF \u099A\u09BE\u0993 \u09A4\u09AC\u09C7`, `\u09AE\u09BF\u09A5\u09BF\u09B2\u09BE \u0986\u099C\u0995\u09C7 \u09AC\u09A1\u09CD\u09A1`]],
      ["fill-mask", [`\u0986\u09AE\u09BF \u09AC\u09BE\u0982\u09B2\u09BE\u09DF <mask> \u0997\u09BE\u0987\u0964`, `\u0986\u09AE\u09BF <mask> \u0996\u09C1\u09AC \u09AD\u09BE\u09B2\u09CB\u09AC\u09BE\u09B8\u09BF\u0964 `]],
      [
        "question-answering",
        [
          {
            text: `\u09AA\u09CD\u09B0\u09A5\u09AE \u098F\u09B6\u09BF\u09AF\u09BC\u09BE \u0995\u09BE\u09AA \u0995\u09CD\u09B0\u09BF\u0995\u09C7\u099F \u099F\u09C1\u09B0\u09CD\u09A8\u09BE\u09AE\u09C7\u09A8\u09CD\u099F \u0995\u09CB\u09A5\u09BE\u09DF \u0985\u09A8\u09C1\u09B7\u09CD\u09A0\u09BF\u09A4 \u09B9\u09DF ?`,
            context: `\u09AA\u09CD\u09B0\u09A5\u09AE \u099F\u09C1\u09B0\u09CD\u09A8\u09BE\u09AE\u09C7\u09A8\u09CD\u099F \u0985\u09A8\u09C1\u09B7\u09CD\u09A0\u09BF\u09A4 \u09B9\u09AF\u09BC \u09E7\u09EF\u09EE\u09EA \u09B8\u09BE\u09B2\u09C7 \u09B8\u0982\u09AF\u09C1\u0995\u09CD\u09A4 \u0986\u09B0\u09AC \u0986\u09AE\u09BF\u09B0\u09BE\u09A4 \u098F\u09B0 \u09B6\u09BE\u09B0\u099C\u09BE\u09B9 \u09A4\u09C7 \u09AF\u09C7\u0996\u09BE\u09A8\u09C7 \u0995\u09BE\u0989\u09A8\u09CD\u09B8\u09BF\u09B2\u09C7\u09B0 \u09AE\u09C2\u09B2 \u0985\u09AB\u09BF\u09B8 \u099B\u09BF\u09B2 (\u09E7\u09EF\u09EF\u09EB \u09AA\u09B0\u09CD\u09AF\u09A8\u09CD\u09A4)\u0964 \u09AD\u09BE\u09B0\u09A4 \u09B6\u09CD\u09B0\u09C0\u09B2\u0999\u09CD\u0995\u09BE\u09B0 \u09B8\u09BE\u09A5\u09C7 \u0986\u09A8\u09CD\u09A4\u09B0\u09BF\u0995\u09A4\u09BE\u09B9\u09C0\u09A8 \u0995\u09CD\u09B0\u09BF\u0995\u09C7\u099F \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09C7\u09B0 \u0995\u09BE\u09B0\u09A3\u09C7 \u09E7\u09EF\u09EE\u09EC \u09B8\u09BE\u09B2\u09C7\u09B0 \u099F\u09C1\u09B0\u09CD\u09A8\u09BE\u09AE\u09C7\u09A8\u09CD\u099F \u09AC\u09B0\u09CD\u099C\u09A8 \u0995\u09B0\u09C7\u0964 \u09E7\u09EF\u09EF\u09E9 \u09B8\u09BE\u09B2\u09C7 \u09AD\u09BE\u09B0\u09A4 \u0993 \u09AA\u09BE\u0995\u09BF\u09B8\u09CD\u09A4\u09BE\u09A8 \u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u09B0\u09BE\u099C\u09A8\u09C8\u09A4\u09BF\u0995 \u0985\u09B8\u09CD\u09A5\u09BF\u09B0\u09A4\u09BE\u09B0 \u0995\u09BE\u09B0\u09A3\u09C7 \u098F\u099F\u09BF \u09AC\u09BE\u09A4\u09BF\u09B2 \u09B9\u09AF\u09BC\u09C7 \u09AF\u09BE\u09AF\u09BC\u0964 \u09B6\u09CD\u09B0\u09C0\u09B2\u0999\u09CD\u0995\u09BE \u098F\u09B6\u09BF\u09AF\u09BC\u09BE \u0995\u09BE\u09AA \u09B6\u09C1\u09B0\u09C1 \u09A5\u09C7\u0995\u09C7 \u0985\u0982\u09B6 \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09C7 \u0986\u09B8\u099B\u09C7\u0964 \u0986\u09A8\u09CD\u09A4\u09B0\u09CD\u099C\u09BE\u09A4\u09BF\u0995 \u0995\u09CD\u09B0\u09BF\u0995\u09C7\u099F \u0995\u09BE\u0989\u09A8\u09CD\u09B8\u09BF\u09B2 \u09A8\u09BF\u09AF\u09BC\u09AE \u0995\u09B0\u09C7 \u09A6\u09BF\u09AF\u09BC\u09C7\u099B\u09C7 \u09AF\u09C7 \u098F\u09B6\u09BF\u09AF\u09BC\u09BE \u0995\u09BE\u09AA\u09C7\u09B0 \u09B8\u0995\u09B2 \u0996\u09C7\u09B2\u09BE \u0985\u09A8\u09C1\u09B7\u09CD\u09A0\u09BF\u09A4 \u09B9\u09AC\u09C7 \u0985\u09AB\u09BF\u09B8\u09BF\u09AF\u09BC\u09BE\u09B2 \u098F\u0995\u09A6\u09BF\u09A8\u09C7\u09B0 \u0986\u09A8\u09CD\u09A4\u09B0\u09CD\u099C\u09BE\u09A4\u09BF\u0995 \u0995\u09CD\u09B0\u09BF\u0995\u09C7\u099F \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7\u0964 \u098F\u09B8\u09BF\u09B8\u09BF \u0998\u09CB\u09B7\u09A8\u09BE \u0985\u09A8\u09C1\u09AF\u09BE\u09AF\u09BC\u09C0 \u09AA\u09CD\u09B0\u09A4\u09BF \u09A6\u09C1\u0987 \u09AC\u099B\u09B0 \u09AA\u09B0 \u09AA\u09B0 \u099F\u09C1\u09B0\u09CD\u09A8\u09BE\u09AE\u09C7\u09A8\u09CD\u099F \u0985\u09A8\u09C1\u09B7\u09CD\u09A0\u09BF\u09A4 \u09B9\u09AF\u09BC \u09E8\u09E6\u09E6\u09EE \u09B8\u09BE\u09B2 \u09A5\u09C7\u0995\u09C7\u0964`
          },
          {
            text: `\u09AD\u09BE\u09B0\u09A4\u09C0\u09AF\u09BC \u09AC\u09BE\u0999\u09BE\u09B2\u09BF \u0995\u09A5\u09BE\u09B8\u09BE\u09B9\u09BF\u09A4\u09CD\u09AF\u09BF\u0995 \u09AE\u09B9\u09BE\u09B6\u09CD\u09AC\u09C7\u09A4\u09BE \u09A6\u09C7\u09AC\u09C0\u09B0 \u09AE\u09C3\u09A4\u09CD\u09AF\u09C1 \u0995\u09AC\u09C7 \u09B9\u09DF ?`,
            context: `\u09E8\u09E6\u09E7\u09EC \u09B8\u09BE\u09B2\u09C7\u09B0 \u09E8\u09E9 \u099C\u09C1\u09B2\u09BE\u0987 \u09B9\u09C3\u09A6\u09B0\u09CB\u0997\u09C7 \u0986\u0995\u09CD\u09B0\u09BE\u09A8\u09CD\u09A4 \u09B9\u09AF\u09BC\u09C7 \u09AE\u09B9\u09BE\u09B6\u09CD\u09AC\u09C7\u09A4\u09BE \u09A6\u09C7\u09AC\u09C0 \u0995\u09B2\u0995\u09BE\u09A4\u09BE\u09B0 \u09AC\u09C7\u09B2 \u09AD\u09BF\u0989 \u0995\u09CD\u09B2\u09BF\u09A8\u09BF\u0995\u09C7 \u09AD\u09B0\u09CD\u09A4\u09BF \u09B9\u09A8\u0964 \u09B8\u09C7\u0987 \u09AC\u099B\u09B0\u0987 \u09E8\u09EE \u099C\u09C1\u09B2\u09BE\u0987 \u098F\u0995\u09BE\u09A7\u09BF\u0995 \u0985\u0999\u09CD\u0997 \u09AC\u09BF\u0995\u09B2 \u09B9\u09AF\u09BC\u09C7 \u09A4\u09BE\u0981\u09B0 \u09AE\u09C3\u09A4\u09CD\u09AF\u09C1 \u0998\u099F\u09C7\u0964 \u09A4\u09BF\u09A8\u09BF \u09AE\u09A7\u09C1\u09AE\u09C7\u09B9, \u09B8\u09C7\u09AA\u09CD\u099F\u09BF\u09B8\u09C7\u09AE\u09BF\u09AF\u09BC\u09BE \u0993 \u09AE\u09C2\u09A4\u09CD\u09B0 \u09B8\u0982\u0995\u09CD\u09B0\u09AE\u09A3 \u09B0\u09CB\u0997\u09C7\u0993 \u09AD\u09C1\u0997\u099B\u09BF\u09B2\u09C7\u09A8\u0964`
          },
          {
            text: `\u09AE\u09BE\u09B8\u09CD\u099F\u09BE\u09B0\u09A6\u09BE \u09B8\u09C2\u09B0\u09CD\u09AF\u0995\u09C1\u09AE\u09BE\u09B0 \u09B8\u09C7\u09A8\u09C7\u09B0 \u09AC\u09BE\u09AC\u09BE\u09B0 \u09A8\u09BE\u09AE \u0995\u09C0 \u099B\u09BF\u09B2 ?`,
            context: `\u09B8\u09C2\u09B0\u09CD\u09AF \u09B8\u09C7\u09A8 \u09E7\u09EE\u09EF\u09EA \u09B8\u09BE\u09B2\u09C7\u09B0 \u09E8\u09E8 \u09AE\u09BE\u09B0\u09CD\u099A \u099A\u099F\u09CD\u099F\u0997\u09CD\u09B0\u09BE\u09AE\u09C7\u09B0 \u09B0\u09BE\u0989\u099C\u09BE\u09A8 \u09A5\u09BE\u09A8\u09BE\u09B0 \u09A8\u09CB\u09AF\u09BC\u09BE\u09AA\u09BE\u09A1\u09BC\u09BE\u09AF\u09BC \u0985\u09B0\u09CD\u09A5\u09A8\u09C8\u09A4\u09BF\u0995 \u09AD\u09BE\u09AC\u09C7 \u0985\u09B8\u09CD\u09AC\u099A\u09CD\u099B\u09B2 \u09AA\u09B0\u09BF\u09AC\u09BE\u09B0\u09C7 \u099C\u09A8\u09CD\u09AE\u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09C7\u09A8\u0964 \u09A4\u09BE\u0981\u09B0 \u09AA\u09BF\u09A4\u09BE\u09B0 \u09A8\u09BE\u09AE \u09B0\u09BE\u099C\u09AE\u09A8\u09BF \u09B8\u09C7\u09A8 \u098F\u09AC\u0982 \u09AE\u09BE\u09A4\u09BE\u09B0 \u09A8\u09BE\u09AE \u09B6\u09B6\u09C0 \u09AC\u09BE\u09B2\u09BE \u09B8\u09C7\u09A8\u0964 \u09B0\u09BE\u099C\u09AE\u09A8\u09BF \u09B8\u09C7\u09A8\u09C7\u09B0 \u09A6\u09C1\u0987 \u099B\u09C7\u09B2\u09C7 \u0986\u09B0 \u099A\u09BE\u09B0 \u09AE\u09C7\u09AF\u09BC\u09C7\u0964 \u09B8\u09C2\u09B0\u09CD\u09AF \u09B8\u09C7\u09A8 \u09A4\u09BE\u0981\u09A6\u09C7\u09B0 \u09AA\u09B0\u09BF\u09AC\u09BE\u09B0\u09C7\u09B0 \u099A\u09A4\u09C1\u09B0\u09CD\u09A5 \u09B8\u09A8\u09CD\u09A4\u09BE\u09A8\u0964 \u09A6\u09C1\u0987 \u099B\u09C7\u09B2\u09C7\u09B0 \u09A8\u09BE\u09AE \u09B8\u09C2\u09B0\u09CD\u09AF \u0993 \u0995\u09AE\u09B2\u0964 \u099A\u09BE\u09B0 \u09AE\u09C7\u09AF\u09BC\u09C7\u09B0 \u09A8\u09BE\u09AE \u09AC\u09B0\u09A6\u09BE\u09B8\u09C1\u09A8\u09CD\u09A6\u09B0\u09C0, \u09B8\u09BE\u09AC\u09BF\u09A4\u09CD\u09B0\u09C0, \u09AD\u09BE\u09A8\u09C1\u09AE\u09A4\u09C0 \u0993 \u09AA\u09CD\u09B0\u09AE\u09BF\u09B2\u09BE\u0964 \u09B6\u09C8\u09B6\u09AC\u09C7 \u09AA\u09BF\u09A4\u09BE \u09AE\u09BE\u09A4\u09BE\u0995\u09C7 \u09B9\u09BE\u09B0\u09BE\u09A8\u09CB \u09B8\u09C2\u09B0\u09CD\u09AF \u09B8\u09C7\u09A8 \u0995\u09BE\u0995\u09BE \u0997\u09CC\u09B0\u09AE\u09A8\u09BF \u09B8\u09C7\u09A8\u09C7\u09B0 \u0995\u09BE\u099B\u09C7 \u09AE\u09BE\u09A8\u09C1\u09B7 \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u09A8\u0964 \u09B8\u09C2\u09B0\u09CD\u09AF \u09B8\u09C7\u09A8 \u099B\u09C7\u09B2\u09C7\u09AC\u09C7\u09B2\u09BE \u09A5\u09C7\u0995\u09C7\u0987 \u0996\u09C1\u09AC \u09AE\u09A8\u09CB\u09AF\u09CB\u0997\u09C0 \u09AD\u09BE\u09B2 \u099B\u09BE\u09A4\u09CD\u09B0 \u099B\u09BF\u09B2\u09C7\u09A8 \u098F\u09AC\u0982 \u09A7\u09B0\u09CD\u09AE\u09AD\u09BE\u09AC\u09BE\u09AA\u09A8\u09CD\u09A8 \u0997\u09AE\u09CD\u09AD\u09C0\u09B0 \u09AA\u09CD\u09B0\u0995\u09C3\u09A4\u09BF\u09B0 \u099B\u09BF\u09B2\u09C7\u09A8\u0964`
          }
        ]
      ],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "\u09B8\u09C7 \u098F\u0995\u099C\u09A8 \u09B8\u09C1\u0996\u09C0 \u09AC\u09CD\u09AF\u0995\u09CD\u09A4\u09BF",
            sentences: ["\u09B8\u09C7 \u09B9\u09CD\u09AF\u09BE\u09AA\u09BF \u0995\u09C1\u0995\u09C1\u09B0", "\u09B8\u09C7 \u0996\u09C1\u09AC \u09B8\u09C1\u0996\u09C0 \u09AE\u09BE\u09A8\u09C1\u09B7", "\u0986\u099C \u098F\u0995\u099F\u09BF \u09B0\u09CC\u09A6\u09CD\u09B0\u09CB\u099C\u09CD\u099C\u09CD\u09AC\u09B2 \u09A6\u09BF\u09A8"]
          }
        ]
      ]
    ]);
    var MAPPING_MN = /* @__PURE__ */ new Map([
      ["text-classification", [`\u0411\u0438 \u0447\u0430\u043C\u0434 \u0445\u0430\u0439\u0440\u0442\u0430\u0439`]],
      [
        "token-classification",
        [
          `\u041D\u0430\u043C\u0430\u0439\u0433 \u0414\u043E\u0440\u0436 \u0433\u044D\u0434\u044D\u0433. \u0411\u0438 \u0423\u043B\u0430\u0430\u043D\u0431\u0430\u0430\u0442\u0430\u0440\u0442 \u0430\u043C\u044C\u0434\u0430\u0440\u0434\u0430\u0433.`,
          `\u041D\u0430\u043C\u0430\u0439\u0433 \u0413\u0430\u043D\u0431\u0430\u0442 \u0433\u044D\u0434\u044D\u0433. \u0411\u0438 \u0423\u0432\u0441 \u0430\u0439\u043C\u0430\u0433\u0442 \u0442\u04E9\u0440\u0441\u04E9\u043D.`,
          `\u041C\u0430\u043D\u0430\u0439 \u0443\u043B\u0441 \u0442\u0430\u0432\u0430\u043D \u0445\u043E\u0448\u0443\u0443 \u043C\u0430\u043B\u0442\u0430\u0439.`
        ]
      ],
      [
        "question-answering",
        [
          {
            text: `\u0422\u0430 \u0445\u0430\u0430\u043D\u0430 \u0430\u043C\u044C\u0434\u0430\u0440\u0434\u0430\u0433 \u0432\u044D?`,
            context: `\u041D\u0430\u043C\u0430\u0439\u0433 \u0414\u043E\u0440\u0436 \u0433\u044D\u0434\u044D\u0433. \u0411\u0438 \u0423\u043B\u0430\u0430\u043D\u0431\u0430\u0430\u0442\u0430\u0440\u0442 \u0430\u043C\u044C\u0434\u0430\u0440\u0434\u0430\u0433.`
          },
          {
            text: `\u0422\u0430\u043D\u044B\u0433 \u0445\u044D\u043D \u0433\u044D\u0434\u044D\u0433 \u0432\u044D?`,
            context: `\u041D\u0430\u043C\u0430\u0439\u0433 \u0414\u043E\u0440\u0436 \u0433\u044D\u0434\u044D\u0433. \u0411\u0438 \u0423\u043B\u0430\u0430\u043D\u0431\u0430\u0430\u0442\u0430\u0440\u0442 \u0430\u043C\u044C\u0434\u0430\u0440\u0434\u0430\u0433.`
          },
          {
            text: `\u041C\u0438\u043D\u0438\u0439 \u043D\u044D\u0440\u0438\u0439\u0433 \u0445\u044D\u043D \u0433\u044D\u0434\u044D\u0433 \u0432\u044D?`,
            context: `\u041D\u0430\u043C\u0430\u0439\u0433 \u0413\u0430\u043D\u0431\u0430\u0442 \u0433\u044D\u0434\u044D\u0433. \u0411\u0438 \u0423\u0432\u0441 \u0430\u0439\u043C\u0430\u0433\u0442 \u0442\u04E9\u0440\u0441\u04E9\u043D.`
          }
        ]
      ],
      ["translation", [`\u041D\u0430\u043C\u0430\u0439\u0433 \u0414\u043E\u0440\u0436 \u0433\u044D\u0434\u044D\u0433. \u0411\u0438 \u0423\u043B\u0430\u0430\u043D\u0431\u0430\u0430\u0442\u0430\u0440\u0442 \u0430\u043C\u044C\u0434\u0430\u0440\u0434\u0430\u0433.`, `\u041D\u0430\u043C\u0430\u0439\u0433 \u0413\u0430\u043D\u0431\u0430\u0442 \u0433\u044D\u0434\u044D\u0433. \u0411\u0438 \u0423\u0432\u0441 \u0430\u0439\u043C\u0430\u0433\u0442 \u0442\u04E9\u0440\u0441\u04E9\u043D.`]],
      [
        "summarization",
        [
          `\u041C\u043E\u043D\u0433\u043E\u043B \u0423\u043B\u0441 (1992 \u043E\u043D\u043E\u043E\u0441 \u0445\u043E\u0439\u0448) \u2014 \u0434\u043E\u0440\u043D\u043E \u0431\u043E\u043B\u043E\u043D \u0442\u04E9\u0432 \u0410\u0437\u0438\u0434 \u043E\u0440\u0448\u0434\u043E\u0433 \u0431\u04AF\u0440\u044D\u043D \u044D\u0440\u0445\u0442 \u0443\u043B\u0441. \u0425\u043E\u0439\u0434 \u0442\u0430\u043B\u0430\u0430\u0440\u0430\u0430 \u041E\u0440\u043E\u0441, \u0431\u0443\u0441\u0430\u0434 \u0442\u0430\u043B\u0430\u0430\u0440\u0430\u0430 \u0425\u044F\u0442\u0430\u0434 \u0443\u043B\u0441\u0442\u0430\u0439 \u0445\u0438\u043B\u043B\u044D\u0434\u044D\u0433 \u0434\u0430\u043B\u0430\u0439\u0434 \u0433\u0430\u0440\u0446\u0433\u04AF\u0439 \u043E\u0440\u043E\u043D. \u041D\u0438\u0439\u0441\u043B\u044D\u043B \u2014 \u0423\u043B\u0430\u0430\u043D\u0431\u0430\u0430\u0442\u0430\u0440 \u0445\u043E\u0442. \u0410\u043B\u0442\u0430\u0439\u043D \u043D\u0443\u0440\u0443\u0443\u043D\u0430\u0430\u0441 \u0425\u044F\u043D\u0433\u0430\u043D, \u0421\u043E\u0451\u043D\u043E\u043E\u0441 \u0413\u043E\u0432\u044C \u0445\u04AF\u0440\u0441\u044D\u043D 1 \u0441\u0430\u044F 566 \u043C\u044F\u043D\u0433\u0430\u043D \u043A\u043C2 \u0443\u0443\u0434\u0430\u043C \u043D\u0443\u0442\u0430\u0433\u0442\u0430\u0439, \u0434\u044D\u043B\u0445\u0438\u0439\u0434 \u043D\u0443\u0442\u0430\u0433 \u0434\u044D\u0432\u0441\u0433\u044D\u0440\u0438\u0439\u043D \u0445\u044D\u043C\u0436\u044D\u044D\u0433\u044D\u044D\u0440 19-\u0440\u0442 \u0436\u0430\u0433\u0441\u0434\u0430\u0433. 2015 \u043E\u043D\u044B \u044D\u0445\u044D\u043D\u0434 \u041C\u043E\u043D\u0433\u043E\u043B \u0423\u043B\u0441\u044B\u043D \u0445\u04AF\u043D \u0430\u043C 3 \u0441\u0430\u044F \u0445\u04AF\u0440\u0441\u044D\u043D (135-\u0440 \u043E\u043B\u043E\u043D). \u04AE\u043D\u0434\u0441\u044D\u043D\u0434\u044D\u044D \u043C\u043E\u043D\u0433\u043E\u043B \u04AF\u043D\u0434\u044D\u0441\u0442\u044D\u043D (95 \u0445\u0443\u0432\u044C), \u043C\u04E9\u043D \u0445\u0430\u0441\u0430\u0433, \u0442\u0443\u0432\u0430 \u0445\u04AF\u043D \u0431\u0430\u0439\u043D\u0430. 16-\u0440 \u0437\u0443\u0443\u043D\u0430\u0430\u0441 \u0445\u043E\u0439\u0448 \u0431\u0443\u0434\u0434\u044B\u043D \u0448\u0430\u0448\u0438\u043D, 20-\u0440 \u0437\u0443\u0443\u043D\u0430\u0430\u0441 \u0448\u0430\u0448\u0438\u043D\u0433\u04AF\u0439 \u0431\u0430\u0439\u0434\u0430\u043B \u0434\u044D\u043B\u0433\u044D\u0440\u0441\u044D\u043D \u0431\u0430 \u0430\u043B\u0431\u0430\u043D \u0445\u044D\u0440\u044D\u0433\u0442 \u043C\u043E\u043D\u0433\u043E\u043B \u0445\u044D\u043B\u044D\u044D\u0440 \u0445\u0430\u0440\u0438\u043B\u0446\u0430\u043D\u0430.`
        ]
      ],
      [
        "text-generation",
        [`\u041D\u0430\u043C\u0430\u0439\u0433 \u0414\u043E\u0440\u0436 \u0433\u044D\u0434\u044D\u0433. \u0411\u0438`, `\u0425\u0430\u043C\u0433\u0438\u0439\u043D \u0441\u0430\u0439\u043D \u0434\u0443\u0443\u0447\u0438\u043D \u0431\u043E\u043B`, `\u041C\u0438\u043D\u0438\u0439 \u0434\u0443\u0440\u0442\u0430\u0439 \u0445\u0430\u043C\u0442\u043B\u0430\u0433 \u0431\u043E\u043B`, `\u042D\u0440\u0442 \u0443\u0440\u044C\u0434\u044B\u043D \u0446\u0430\u0433\u0442`]
      ],
      ["fill-mask", [`\u041C\u043E\u043D\u0433\u043E\u043B \u0443\u043B\u0441\u044B\u043D <mask> \u0423\u043B\u0430\u0430\u043D\u0431\u0430\u0430\u0442\u0430\u0440 \u0445\u043E\u0442\u043E\u043E\u0441 \u044F\u0440\u044C\u0436 \u0431\u0430\u0439\u043D\u0430.`, `\u041C\u0438\u043D\u0438\u0439 \u0430\u043C\u044C\u0434\u0440\u0430\u043B\u044B\u043D \u0437\u043E\u0440\u0438\u043B\u0433\u043E \u0431\u043E\u043B <mask>.`]],
      [
        "automatic-speech-recognition",
        [
          {
            label: `Common Voice Train Example`,
            src: `https://cdn-media.huggingface.co/common_voice/train/common_voice_mn_18577472.wav`
          },
          {
            label: `Common Voice Test Example`,
            src: `https://cdn-media.huggingface.co/common_voice/test/common_voice_mn_18577346.wav`
          }
        ]
      ],
      [
        "text-to-speech",
        [
          `\u0411\u0438 \u041C\u043E\u043D\u0433\u043E\u043B \u0443\u043B\u0441\u044B\u043D \u0438\u0440\u0433\u044D\u043D.`,
          `\u042D\u043D\u044D\u0445\u04AF\u04AF \u0436\u0438\u0448\u044D\u044D \u043D\u044C \u0446\u0430\u0430\u043D\u0430\u0430 \u044F\u043C\u0430\u0440 \u0447 \u0443\u0442\u0433\u0430 \u0430\u0433\u0443\u0443\u043B\u0430\u0430\u0433\u04AF\u0439 \u0431\u043E\u043B\u043D\u043E`,
          `\u0421\u0430\u0440 \u0448\u0438\u043D\u044D\u0434\u044D\u044D \u0441\u0430\u0439\u0445\u0430\u043D \u0448\u0438\u043D\u044D\u043B\u044D\u0436 \u0431\u0430\u0439\u043D\u0430 \u0443\u0443?`
        ]
      ],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "\u042D\u043D\u044D \u0431\u043E\u043B \u0430\u0437 \u0436\u0430\u0440\u0433\u0430\u043B\u0442\u0430\u0439 \u0445\u04AF\u043D \u044E\u043C",
            sentences: ["\u042D\u043D\u044D \u0431\u043E\u043B \u0430\u0437 \u0436\u0430\u0440\u0433\u0430\u043B\u0442\u0430\u0439 \u043D\u043E\u0445\u043E\u0439 \u044E\u043C", "\u042D\u043D\u044D \u0431\u043E\u043B \u043C\u0430\u0448 \u0438\u0445 \u0430\u0437 \u0436\u0430\u0440\u0433\u0430\u043B\u0442\u0430\u0439 \u0445\u04AF\u043D \u044E\u043C", "\u04E8\u043D\u04E9\u04E9\u0434\u04E9\u0440 \u043D\u0430\u0440\u043B\u0430\u0433 \u04E9\u0434\u04E9\u0440 \u0431\u0430\u0439\u043D\u0430"]
          }
        ]
      ]
    ]);
    var MAPPING_SI = /* @__PURE__ */ new Map([
      ["translation", [`\u0DC3\u0DD2\u0D82\u0DC4\u0DBD \u0D89\u0DAD\u0DCF \u0D85\u0DBD\u0D82\u0D9A\u0DCF\u0DBB \u0DB7\u0DCF\u0DC2\u0DCF\u0DC0\u0D9A\u0DD2.`, `\u0DB8\u0DD9\u0DB8 \u0DAD\u0DCF\u0D9A\u0DCA\u0DC2\u0DAB\u0DBA \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DCF \u0D9A\u0DBB\u0DB1 \u0D94\u0DB6\u0DA7 \u0DC3\u0DCA\u0DAD\u0DD6\u0DAD\u0DD2\u0DBA\u0DD2.`]],
      ["fill-mask", [`\u0DB8\u0DB8 \u0D9C\u0DD9\u0DAF\u0DBB <mask>.`, `<mask> \u0D89\u0D9C\u0DD9\u0DB1\u0DD3\u0DB8\u0DA7 \u0D9C\u0DD2\u0DBA\u0DCF\u0DBA.`]]
    ]);
    var MAPPING_DE = /* @__PURE__ */ new Map([
      [
        "question-answering",
        [
          {
            text: `Wo wohne ich?`,
            context: `Mein Name ist Wolfgang und ich lebe in Berlin`
          },
          {
            text: `Welcher Name wird auch verwendet, um den Amazonas-Regenwald auf Englisch zu beschreiben?`,
            context: `Der Amazonas-Regenwald, auf Englisch auch als Amazonien oder Amazonas-Dschungel bekannt, ist ein feuchter Laubwald, der den gr\xF6\xDFten Teil des Amazonas-Beckens S\xFCdamerikas bedeckt. Dieses Becken umfasst 7.000.000 Quadratkilometer (2.700.000 Quadratmeilen), von denen 5.500.000 Quadratkilometer (2.100.000 Quadratmeilen) vom Regenwald bedeckt sind. Diese Region umfasst Gebiete von neun Nationen. Der gr\xF6\xDFte Teil des Waldes befindet sich in Brasilien mit 60% des Regenwaldes, gefolgt von Peru mit 13%, Kolumbien mit 10% und geringen Mengen in Venezuela, Ecuador, Bolivien, Guyana, Suriname und Franz\xF6sisch-Guayana. Staaten oder Abteilungen in vier Nationen enthalten "Amazonas" in ihren Namen. Der Amazonas repr\xE4sentiert mehr als die H\xE4lfte der verbleibenden Regenw\xE4lder des Planeten und umfasst den gr\xF6\xDFten und artenreichsten tropischen Regenwald der Welt mit gesch\xE4tzten 390 Milliarden Einzelb\xE4umen, die in 16.000 Arten unterteilt sind.`
          }
        ]
      ],
      [
        "sentence-similarity",
        [
          {
            source_sentence: "Das ist eine gl\xFCckliche Person",
            sentences: [
              "Das ist ein gl\xFCcklicher Hund",
              "Das ist eine sehr gl\xFCckliche Person",
              "Heute ist ein sonniger Tag"
            ]
          }
        ]
      ]
    ]);
    var MAPPING_DV = /* @__PURE__ */ new Map([
      ["text-classification", [`\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078E\u07A6\u0794\u07A7\u0788\u07AD. \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078D\u07AF\u0784\u07A8\u0788\u07AD`]],
      [
        "token-classification",
        [
          `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0787\u07A6\u0780\u07AA\u0789\u07A6\u078B\u07AA \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u0789\u07A7\u078D\u07AD\u078E\u07A6`,
          `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0790\u07A7\u0783\u07A7 \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u0787\u07AA\u078C\u07A9\u0789\u07AA\u078E\u07A6`,
          `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0787\u07A6\u0787\u07A8\u079D\u07A7 \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u078A\u07AD\u078B\u07AB\u060C \u0787\u07A6\u0787\u07B0\u0791\u07AB\u078E\u07A6`
        ]
      ],
      [
        "question-answering",
        [
          {
            text: `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u0786\u07AE\u0782\u07B0\u078C\u07A7\u0786\u07AA\u061F`,
            context: `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0787\u07A6\u0780\u07AA\u0789\u07A6\u078B\u07AA \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u0789\u07A7\u078D\u07AD\u078E\u07A6`
          },
          {
            text: `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u0786\u07AE\u0782\u07B0\u078C\u07A7\u0786\u07AA\u061F`,
            context: `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0790\u07A7\u0783\u07A7 \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u0787\u07AA\u078C\u07A9\u0789\u07AA\u078E\u07A6`
          },
          {
            text: `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0786\u07AE\u0784\u07A7\u061F`,
            context: `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0787\u07A6\u0787\u07A8\u079D\u07A7 \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u078A\u07AD\u078B\u07AB\u078E\u07A6`
          },
          {
            text: `\u0787\u07AC\u0789\u07AD\u0792\u07A6\u0782\u07B0 \u0783\u07AC\u0787\u07A8\u0782\u07B0\u078A\u07AE\u0783\u07AC\u0790\u07B0\u0793\u07B0 \u0790\u07A8\u078A\u07A6\u0786\u07AE\u0781\u07B0\u078B\u07A8\u0782\u07AA\u0789\u07A6\u0781\u07B0 \u0787\u07A8\u0782\u078E\u07A8\u0783\u07AD\u0790\u07A8 \u0784\u07A6\u0780\u07AA\u0782\u07B0 \u0784\u07AD\u0782\u07AA\u0782\u07B0\u0786\u07AA\u0783\u07A7\u0782\u07A9 \u0786\u07AE\u0782\u07B0\u0782\u07A6\u0789\u07AC\u0787\u07B0\u061F`,
            context: `\u0787\u07AC\u0789\u07AD\u0792\u07A6\u0782\u07B0 \u0783\u07AC\u0787\u07A8\u0782\u07B0\u078A\u07AE\u0783\u07AC\u0790\u07B0\u0793\u07B0 (\u0795\u07AF\u0797\u07AA\u0796\u07A9\u0792\u07B0: \u078A\u07B0\u078D\u07AE\u0783\u07AC\u0790\u07B0\u0793\u07A7 \u0787\u07AC\u0789\u07A6\u0790\u07AE\u0782\u07A8\u0786\u07A7 \u0782\u07AA\u0788\u07A6\u078C\u07A6 \u0787\u07AC\u0789\u07A6\u0790\u07AE\u0782\u07A8\u0787\u07A7\u061B \u0790\u07B0\u0795\u07AC\u0782\u07A8\u079D\u07B0: \u0790\u07AC\u078D\u07B0\u0788\u07A7 \u0787\u07AC\u0789\u07A6\u0790\u07AE\u0782\u07A8\u0786\u07A7, \u0787\u07AC\u0789\u07A6\u0790\u07AE\u0782\u07A8\u0787\u07A7 \u0782\u07AB\u0782\u07A9 \u0787\u07A7\u0782\u07B0\u0789\u07AA\u0786\u07AE\u0781\u07B0 \u0787\u07AC\u0789\u07A6\u0792\u07AF\u0782\u07A8\u0787\u07A7\u061B \u078A\u07B0\u0783\u07AC\u0782\u07B0\u0797\u07B0: \u078A\u07AE\u0783\u07AD \u0787\u07AC\u0789\u07AC\u0792\u07AE\u0782\u07A8\u0787\u07AC\u0782\u07B0\u061B \u0791\u07A6\u0797\u07B0: \u0787\u07AC\u0789\u07AC\u0792\u07AF\u0782\u07B0\u0783\u07AD\u078E\u07AC\u0788\u07A6\u0787\u07AA\u0791\u07B0)\u060C \u0787\u07A8\u078E\u07A8\u0783\u07AD\u0790\u07A8 \u0784\u07A6\u0780\u07AA\u0782\u07B0 \u0784\u07AA\u0782\u07A7 \u0787\u07AC\u0789\u07AC\u0792\u07AF\u0782\u07A8\u0787\u07A7 \u0782\u07AA\u0788\u07A6\u078C\u07A6 \u078B\u07A6 \u0787\u07AC\u0789\u07AD\u0792\u07A6\u0782\u07B0 \u0796\u07A6\u0782\u07B0\u078E\u07A6\u078D\u07B0 \u0787\u07A6\u0786\u07A9, \u0790\u07A6\u0787\u07AA\u078C\u07AA \u0787\u07AC\u0789\u07AC\u0783\u07A8\u0786\u07A7\u078E\u07AC \u0787\u07AC\u0789\u07AD\u0792\u07A6\u0782\u07B0 \u0784\u07AD\u0790\u07A8\u0782\u07B0 \u0790\u07A6\u0783\u07A6\u0780\u07A6\u0787\u07B0\u078B\u07AA\u078E\u07AC \u0784\u07AE\u0791\u07AA\u0784\u07A6\u0787\u07AC\u0787\u07B0\u078E\u07A6\u0787\u07A8 \u0780\u07A8\u0789\u07AC\u0782\u07AD \u0789\u07AE\u0787\u07A8\u0790\u07B0\u0793\u07B0 \u0784\u07AE\u0783\u07AF\u0791\u07B0\u078D\u07A9\u078A\u07B0 \u078A\u07AE\u0783\u07AC\u0790\u07B0\u0793\u07AC\u0787\u07AC\u0786\u07AC\u0788\u07AC. \u0787\u07AC\u0789\u07AD\u0792\u07A6\u0782\u07B0 \u0784\u07AD\u0790\u07A8\u0782\u07B0 \u0790\u07A6\u0783\u07A6\u0780\u07A6\u0787\u07B0\u078B\u07AA\u078E\u07AC \u0784\u07AE\u0791\u07AA \u0789\u07A8\u0782\u07A6\u0786\u07A9 7 \u0789\u07A8\u078D\u07A8\u0787\u07A6\u0782\u07B0 \u0787\u07A6\u0786\u07A6 \u0786\u07A8\u078D\u07AF\u0789\u07A9\u0793\u07A6\u0783 (2.7 \u0789\u07A8\u078D\u07A8\u0787\u07A6\u0782\u07B0 \u0787\u07A6\u0786\u07A6 \u0789\u07A6\u0787\u07A8\u078D\u07B0(. \u0789\u07A9\u078E\u07AC \u078C\u07AC\u0783\u07AC\u0787\u07A8\u0782\u07B0 5.5 \u0789\u07A8\u078D\u07A8\u0787\u07A6\u0782\u07B0 \u0787\u07A6\u0786\u07A6 \u0786\u07A8\u078D\u07AF\u0789\u07A9\u0793\u07A6\u0783 (2.1 \u0789\u07A8\u078D\u07A8\u0787\u07A6\u0782\u07B0 \u0787\u07A6\u0786\u07A6 \u0789\u07A6\u0787\u07A8\u078D\u07B0) \u0787\u07A6\u0786\u07A9 \u0789\u07A8 \u078A\u07AE\u0783\u07AC\u0790\u07B0\u0793\u07AC\u0788\u07AC. \u0789\u07A8 \u0790\u07A6\u0783\u07A6\u0780\u07A6\u0787\u07B0\u078B\u07AA\u078E\u07A6\u0787\u07A8 9 \u078E\u07A6\u0787\u07AA\u0789\u07A6\u0786\u07A6\u0781\u07B0 \u0782\u07A8\u0790\u07B0\u0784\u07A6\u078C\u07B0\u0788\u07A7 \u0793\u07AC\u0783\u07A8\u0793\u07A6\u0783\u07A9 \u0780\u07A8\u0789\u07AC\u0782\u07AC\u0787\u07AC\u0788\u07AC.  60% \u0787\u07A7\u0787\u07A8\u0787\u07AC\u0786\u07AC \u0787\u07AC\u0782\u07B0\u0789\u07AC \u0784\u07AE\u0791\u07AA \u0784\u07A6\u0787\u07AC\u0787\u07B0 \u0782\u07A8\u0790\u07B0\u0784\u07A6\u078C\u07B0\u0788\u07A6\u0782\u07A9 \u0784\u07B0\u0783\u07AC\u0792\u07A8\u078D\u07B0\u0787\u07A6\u0781\u07AC\u0788\u07AC. \u0787\u07AD\u078E\u07AC \u078A\u07A6\u0780\u07AA\u078C\u07AA\u0782\u07B0 13% \u0787\u07A7\u0787\u07AC\u0786\u07AA \u0795\u07AC\u0783\u07AB \u0787\u07A7\u0787\u07A8 10% \u0787\u07A7\u0787\u07AC\u0786\u07AA \u0786\u07AE\u078D\u07A6\u0789\u07B0\u0784\u07A8\u0787\u07A7 \u0787\u07A6\u078B\u07A8 \u0786\u07AA\u0791\u07A6 \u0784\u07A6\u0787\u07AC\u0787\u07B0 \u0780\u07A8\u0789\u07AC\u0782\u07AD \u078E\u07AE\u078C\u07AA\u0782\u07B0 \u0788\u07AC\u0782\u07AC\u0792\u07AA\u0787\u07AC\u078D\u07A7, \u0787\u07AC\u0786\u07B0\u0787\u07A6\u0791\u07AF, \u0784\u07AE\u078D\u07A8\u0788\u07A8\u0787\u07A7, \u078E\u07AA\u0794\u07A7\u0782\u07A7, \u0790\u07AA\u0783\u07A8\u0782\u07A7\u0789\u07B0 \u0787\u07A6\u078B\u07A8 \u078A\u07B0\u0783\u07AC\u0782\u07B0\u0797\u07B0 \u078E\u07B0\u0787\u07A7\u0782\u07A7 \u0787\u07A6\u0781\u07B0 \u0788\u07AC\u0790\u07B0 \u0782\u07A8\u0790\u07B0\u0784\u07A6\u078C\u07B0\u0788\u07AC\u0787\u07AC\u0788\u07AC. \u0789\u07A9\u078E\u07AC \u078C\u07AC\u0783\u07AC\u0787\u07A8\u0782\u07B0 4 \u078E\u07A6\u0787\u07AA\u0789\u07AC\u0787\u07B0\u078E\u07A6\u0787\u07A8 "\u0787\u07AC\u0789\u07AC\u0792\u07AE\u0782\u07A7\u0790\u07B0" \u0780\u07A8\u0789\u07A6\u0782\u07A6\u0787\u07A8\u078E\u07AC\u0782\u07B0 \u0790\u07B0\u0793\u07AD\u0793\u07B0 \u0782\u07AA\u0788\u07A6\u078C\u07A6 \u0791\u07A8\u0795\u07A7\u0793\u07B0\u0789\u07A6\u0782\u07B0\u0793\u07B0 \u0787\u07A6\u0786\u07A6\u0781\u07B0 \u0782\u07A6\u0782\u07B0\u078B\u07A9\u078A\u07A6\u0787\u07A8\u0788\u07AC\u0787\u07AC\u0788\u07AC. \u0789\u07AA\u0785\u07A8 \u078B\u07AA\u0782\u07A8\u0794\u07AD\u078E\u07A6\u0787\u07A8 \u0784\u07A7\u0786\u07A9 \u0780\u07AA\u0783\u07A8 \u0783\u07AC\u0787\u07A8\u0782\u07B0\u078A\u07AE\u0783\u07AC\u0790\u07B0\u0793\u07B0\u078E\u07AC \u078C\u07AC\u0783\u07AC\u0787\u07A8\u0782\u07B0 \u078B\u07AC\u0784\u07A6\u0787\u07A8\u0786\u07AA\u0785\u07A6 \u0787\u07AC\u0787\u07B0\u0784\u07A6\u0794\u07A6\u0781\u07B0\u0788\u07AA\u0783\u07AC\u0784\u07AE\u0791\u07AA\u0788\u07A6\u0783\u07AC\u0787\u07B0 \u0787\u07AC\u0789\u07AD\u0792\u07AE\u0782\u07B0 \u0783\u07AC\u0787\u07A8\u0782\u07B0\u078A\u07AE\u0783\u07AC\u0790\u07B0\u0793\u07B0 \u0780\u07A8\u0787\u07B0\u0790\u07A7\u0786\u07AA\u0783\u07AC\u0787\u07AC\u0788\u07AC. \u0789\u07A8\u0787\u07A9 \u0789\u07AA\u0785\u07A8 \u078B\u07AA\u0782\u07A8\u0794\u07AC\u0787\u07A8\u0782\u07B0 \u0787\u07AC\u0782\u07B0\u0789\u07AE \u0784\u07AE\u0791\u07AA \u0787\u07A6\u078B\u07A8 \u0787\u07AC\u0782\u07B0\u0789\u07AC \u0784\u07A6\u0787\u07AE\u0791\u07A6\u0787\u07A8\u0788\u07A6\u0783\u0790\u07B0 \u0783\u07AC\u0787\u07A8\u0782\u07B0\u078A\u07AE\u0783\u07AC\u0790\u07B0\u0793\u07B0 \u0793\u07B0\u0783\u07AC\u0786\u07B0\u0793\u07AC\u0788\u07AC. \u078D\u07A6\u078A\u07A7\u0786\u07AA\u0783\u07AC\u0788\u07AD \u078E\u07AE\u078C\u07AA\u0782\u07B0 16 \u0780\u07A7\u0790\u07B0 \u0790\u07B0\u0795\u07A9\u079D\u07A9\u0790\u07B0\u0787\u07A6\u0781\u07B0 \u0784\u07AC\u0780\u07A8\u078E\u07AC\u0782\u07B0\u0788\u07A7 390 \u0789\u07A8\u078D\u07A8\u0787\u07A6\u0782\u07B0 \u0788\u07A6\u0787\u07B0\u078C\u07A6\u0783\u07AA\u078E\u07AC \u078E\u07A6\u0790\u07B0 \u0789\u07A8\u078C\u07A7\u078E\u07A6\u0787\u07A8 \u0780\u07A8\u0789\u07AC\u0782\u07AC\u0787\u07AC\u0788\u07AC`
          }
        ]
      ],
      [
        "translation",
        [
          `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0787\u07A6\u0780\u07AA\u0789\u07A6\u078B\u07AA \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u0789\u07A7\u078D\u07AD\u078E\u07A6`,
          `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0790\u07A7\u0783\u07A7 \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u078B\u07A8\u0783\u07A8\u0787\u07AA\u0785\u07AC\u0782\u07A9 \u0787\u07AA\u078C\u07A9\u0789\u07AA\u078E\u07A6`
        ]
      ],
      [
        "summarization",
        [
          `\u0793\u07A6\u0788\u07A6\u0783\u07AA\u078E\u07AC \u0787\u07AA\u0790\u07B0\u0789\u07A8\u0782\u07A6\u0786\u07A9 324 \u0789\u07A9\u0793\u07A6\u0783\u07AA\u060C \u0787\u07AC\u0787\u07A9 \u078E\u07A7\u078C\u07B0\u078E\u07A6\u0782\u0791\u07A6\u0786\u07A6\u0781\u07B0 81 \u0784\u07AA\u0783\u07A9\u078E\u07AC \u0787\u07A8\u0789\u07A7\u0783\u07A7\u078C\u07A6\u0786\u07A7\u0787\u07A8 \u0787\u07AC\u0787\u07B0\u0788\u07A6\u0783\u07AC\u0788\u07AC. \u0787\u07AC\u0787\u07A9 \u0795\u07AC\u0783\u07A8\u0790\u07B0\u078E\u07A6\u0787\u07A8 \u0780\u07AA\u0783\u07A8 \u0787\u07AC\u0782\u07B0\u0789\u07AC \u0787\u07AA\u0790\u07B0 \u0787\u07A8\u0789\u07A7\u0783\u07A7\u078C\u07AC\u0788\u07AC. \u0787\u07AD\u078E\u07AC \u0780\u07A6\u078C\u07A6\u0783\u07AC\u0790\u07B0\u0786\u07A6\u0782\u07A6\u0781\u07B0 \u0780\u07AA\u0783\u07A8 \u0784\u07AA\u0791\u07AA\u078E\u07AC \u078B\u07A8\u078E\u07AA\u0789\u07A8\u0782\u07A6\u0786\u07A9 \u0786\u07AE\u0782\u07B0\u0789\u07AC \u078A\u07A6\u0783\u07A7\u078C\u07A6\u0786\u07AA\u0782\u07B0 125 \u0789\u07A9\u0793\u07A6\u0783\u07AC\u0788\u07AC. (410 \u078A\u07AB\u0793\u07AA) \u0787\u07A6\u0787\u07A8\u078A\u07A8\u078D\u07B0 \u0793\u07A6\u0788\u07A6\u0783\u07AA \u0784\u07A8\u0782\u07A7\u0786\u07AA\u0783\u07A8 \u0787\u07A8\u0783\u07AA\u060C \u0788\u07AE\u079D\u07A8\u0782\u07B0\u078E\u07B0\u0793\u07A6\u0782\u07B0 \u0789\u07AE\u0782\u07A8\u0787\u07AA\u0789\u07AC\u0782\u07B0\u0793\u07B0\u078E\u07AC \u0787\u07AA\u0790\u07B0\u0789\u07A8\u0782\u07B0 \u078A\u07A6\u0780\u07A6\u0782\u07A6\u0787\u07A6\u0785\u07A7 \u078E\u07AE\u0790\u07B0\u060C \u078B\u07AA\u0782\u07A8\u0794\u07AD\u078E\u07A6\u0787\u07A8 \u0789\u07A9\u0780\u07AA\u0782\u07B0 \u0787\u07AA\u078A\u07AC\u0787\u07B0\u078B\u07A8 \u078C\u07A6\u0782\u07B0\u078C\u07A6\u0782\u07AA\u078E\u07AC \u078C\u07AC\u0783\u07AC\u0787\u07A8\u0782\u07B0 \u0787\u07AC\u0782\u07B0\u0789\u07AC \u0787\u07AA\u0790\u07B0 \u078C\u07A6\u0782\u07AA\u078E\u07AC \u078D\u07A6\u078E\u07A6\u0784\u07AA \u078D\u07A8\u0784\u07AA\u0782\u07AC\u0788\u07AC. \u0787\u07A6\u078B\u07A8 1930 \u078E\u07A6\u0787\u07A8 \u0782\u07A8\u0787\u07AA \u0794\u07AF\u0786\u07B0\u078E\u07AC \u0786\u07B0\u0783\u07A6\u0787\u07A8\u0790\u07B0\u078D\u07A6\u0783 \u0784\u07A8\u078D\u07B0\u0791\u07A8\u0782\u07B0\u078E\u07B0 \u0784\u07A8\u0782\u07A7\u0786\u07AA\u0783\u07AA\u0789\u07A7\u0787\u07A8 \u0780\u07A6\u0789\u07A6\u0787\u07A6\u0781\u07B0 41 \u0787\u07A6\u0780\u07A6\u0783\u07AA \u0788\u07A6\u0782\u07B0\u078B\u07AC\u0782\u07B0 \u0789\u07A8\u078D\u07A6\u078E\u07A6\u0784\u07AA \u0780\u07A8\u078A\u07AC\u0780\u07AC\u0787\u07B0\u0793\u07A8\u0787\u07AC\u0788\u07AC. \u0789\u07A8\u0787\u07A9 300 \u0789\u07A9\u0793\u07A6\u0783\u07A6\u0781\u07B0 \u0788\u07AA\u0783\u07AC \u0787\u07AA\u0790\u07B0\u0786\u07AE\u0781\u07B0 \u0787\u07A8\u0789\u07A7\u0783\u07A7\u078C\u07B0\u0786\u07AA\u0783\u07AC\u0788\u07AA\u0782\u07AA \u078A\u07AA\u0783\u07A6\u078C\u07A6\u0789\u07A6 \u078C\u07A6\u0782\u07AC\u0788\u07AC. 1957 \u078E\u07A6\u0787\u07A8 \u0793\u07A6\u0788\u07A6\u0783\u07AA\u078E\u07AC \u0787\u07AC\u0782\u07B0\u0789\u07AC \u0789\u07A6\u078C\u07A9\u078E\u07A6\u0787\u07A8 \u0780\u07A6\u0783\u07AA\u0786\u07AA\u0783\u07AC\u0788\u07AA\u0782\u07AA \u0784\u07B0\u0783\u07AF\u0791\u07B0\u0786\u07A7\u0790\u07B0\u0793\u07A8\u0782\u07B0\u078E \u0787\u07AD\u0783\u07A8\u0787\u07A6\u078D\u07B0\u078E\u07AC \u0790\u07A6\u0784\u07A6\u0784\u07AA\u0782\u07B0 \u0789\u07A8\u0780\u07A7\u0783\u07AA \u0789\u07A8 \u0793\u07A6\u0788\u07A6\u0783\u07AA \u0786\u07B0\u0783\u07A6\u0787\u07A8\u0790\u07B0\u078D\u07A6\u0783 \u0784\u07A8\u078D\u07B0\u0791\u07A8\u0782\u07B0\u078E\u0787\u07A6\u0781\u07B0 \u0788\u07AA\u0783\u07AC 5.2 \u0789\u07A9\u0793\u07A6\u0783 (17 \u078A\u07AB\u0793\u07AA) \u0787\u07AA\u0780\u07AC\u0788\u07AC. \u0789\u07A8 \u0793\u07B0\u0783\u07A7\u0782\u07B0\u0790\u07B0\u0789\u07A8\u0793\u07A6\u0783\u07AA \u0782\u07AA\u078D\u07A7\u060C \u0787\u07A6\u0787\u07A8\u078A\u07A8\u078D\u07B0 \u0793\u07A6\u0788\u07A6\u0783\u07A6\u0786\u07A9\u060C \u0789\u07A8\u078D\u07A7\u0787\u07AA \u0788\u07A8\u0787\u07A7\u0791\u07A6\u0786\u07B0\u0793\u07A6\u0781\u07B0 \u078A\u07A6\u0780\u07AA \u078A\u07B0\u0783\u07A7\u0782\u07B0\u0790\u07B0\u078E\u07A6\u0787\u07A8 \u0780\u07AA\u0783\u07A8 2 \u0788\u07A6\u0782\u07A6\u0787\u07A6\u0781\u07B0 \u0787\u07AC\u0782\u07B0\u0789\u07AC \u0787\u07AA\u0790\u07B0 \u078A\u07B0\u0783\u07A9\u0790\u07B0\u0793\u07AD\u0782\u07B0\u0791\u07A8\u0782\u07B0\u078E \u0787\u07A8\u0789\u07A7\u0783\u07A7\u078C\u07AC\u0788\u07AC`
        ]
      ],
      [
        "text-generation",
        [
          `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0794\u07AB\u0790\u07AA\u078A\u07B0 \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0789\u07A6\u0787\u07A8\u078E\u07A6\u0782\u0791\u07AA`,
          `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u0789\u07A6\u0783\u07A8\u0787\u07A6\u0789\u07B0\u060C \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0 \u0787\u07AC\u0782\u07B0\u0789\u07AC \u078E\u07A6\u0794\u07A7\u0788\u07A7`,
          `\u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0\u078E\u07AC \u0782\u07A6\u0789\u07A6\u0786\u07A9 \u078A\u07A7\u078C\u07AA\u0789\u07A6\u078C\u07AA \u0787\u07A6\u078B\u07A8 \u0787\u07A6\u0780\u07A6\u0783\u07AC\u0782\u07B0`,
          `\u060C\u0787\u07AC\u0787\u07B0 \u0792\u07A6\u0789\u07A7\u0782\u07AC\u0787\u07B0\u078E\u07A6\u0787\u07A8`
        ]
      ],
      ["fill-mask", [`.<mask> \u0789\u07A7\u078D\u07AC \u0787\u07A6\u0786\u07A9 \u078B\u07A8\u0788\u07AC\u0780\u07A8\u0783\u07A7\u0787\u07B0\u0796\u07AD\u078E\u07AC`, `\u078E\u07A6\u0783\u07AA\u078B\u07A8\u0794\u07A6\u0787\u07A6\u0786\u07A9 \u078B\u07A8\u0788\u07AC\u0780\u07A8\u0782\u07B0\u078E\u07AC \u0789\u07AC\u078B\u07AA\u078E\u07A6\u0787\u07A8 <mask> \u0786\u07AC\u0787\u07AA\u0789\u07AC\u0787\u07B0.`]]
    ]);
    exports2.MAPPING_DEFAULT_WIDGET = /* @__PURE__ */ new Map([
      ["en", MAPPING_EN],
      ["zh", MAPPING_ZH],
      ["fr", MAPPING_FR],
      ["es", MAPPING_ES],
      ["ru", MAPPING_RU],
      ["uk", MAPPING_UK],
      ["it", MAPPING_IT],
      ["fa", MAPPING_FA],
      ["ar", MAPPING_AR],
      ["bn", MAPPING_BN],
      ["mn", MAPPING_MN],
      ["si", MAPPING_SI],
      ["de", MAPPING_DE],
      ["dv", MAPPING_DV]
    ]);
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/pipelines.js
var require_pipelines = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/pipelines.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PIPELINE_TYPES_SET = exports2.SUBTASK_TYPES = exports2.PIPELINE_TYPES = exports2.PIPELINE_DATA = exports2.MODALITY_LABELS = exports2.MODALITIES = void 0;
    exports2.MODALITIES = ["multimodal", "nlp", "cv", "audio", "tabular", "rl", "other"];
    exports2.MODALITY_LABELS = {
      multimodal: "Multimodal",
      nlp: "Natural Language Processing",
      audio: "Audio",
      cv: "Computer Vision",
      rl: "Reinforcement Learning",
      tabular: "Tabular",
      other: "Other"
    };
    exports2.PIPELINE_DATA = {
      "text-classification": {
        name: "Text Classification",
        subtasks: [
          {
            type: "acceptability-classification",
            name: "Acceptability Classification"
          },
          {
            type: "entity-linking-classification",
            name: "Entity Linking Classification"
          },
          {
            type: "fact-checking",
            name: "Fact Checking"
          },
          {
            type: "intent-classification",
            name: "Intent Classification"
          },
          {
            type: "language-identification",
            name: "Language Identification"
          },
          {
            type: "multi-class-classification",
            name: "Multi Class Classification"
          },
          {
            type: "multi-label-classification",
            name: "Multi Label Classification"
          },
          {
            type: "multi-input-text-classification",
            name: "Multi-input Text Classification"
          },
          {
            type: "natural-language-inference",
            name: "Natural Language Inference"
          },
          {
            type: "semantic-similarity-classification",
            name: "Semantic Similarity Classification"
          },
          {
            type: "sentiment-classification",
            name: "Sentiment Classification"
          },
          {
            type: "topic-classification",
            name: "Topic Classification"
          },
          {
            type: "semantic-similarity-scoring",
            name: "Semantic Similarity Scoring"
          },
          {
            type: "sentiment-scoring",
            name: "Sentiment Scoring"
          },
          {
            type: "sentiment-analysis",
            name: "Sentiment Analysis"
          },
          {
            type: "hate-speech-detection",
            name: "Hate Speech Detection"
          },
          {
            type: "text-scoring",
            name: "Text Scoring"
          }
        ],
        modality: "nlp"
      },
      "token-classification": {
        name: "Token Classification",
        subtasks: [
          {
            type: "named-entity-recognition",
            name: "Named Entity Recognition"
          },
          {
            type: "part-of-speech",
            name: "Part of Speech"
          },
          {
            type: "parsing",
            name: "Parsing"
          },
          {
            type: "lemmatization",
            name: "Lemmatization"
          },
          {
            type: "word-sense-disambiguation",
            name: "Word Sense Disambiguation"
          },
          {
            type: "coreference-resolution",
            name: "Coreference-resolution"
          }
        ],
        modality: "nlp"
      },
      "table-question-answering": {
        name: "Table Question Answering",
        modality: "nlp"
      },
      "question-answering": {
        name: "Question Answering",
        subtasks: [
          {
            type: "extractive-qa",
            name: "Extractive QA"
          },
          {
            type: "open-domain-qa",
            name: "Open Domain QA"
          },
          {
            type: "closed-domain-qa",
            name: "Closed Domain QA"
          }
        ],
        modality: "nlp"
      },
      "zero-shot-classification": {
        name: "Zero-Shot Classification",
        modality: "nlp"
      },
      translation: {
        name: "Translation",
        modality: "nlp"
      },
      summarization: {
        name: "Summarization",
        subtasks: [
          {
            type: "news-articles-summarization",
            name: "News Articles Summarization"
          },
          {
            type: "news-articles-headline-generation",
            name: "News Articles Headline Generation"
          }
        ],
        modality: "nlp"
      },
      "feature-extraction": {
        name: "Feature Extraction",
        modality: "nlp"
      },
      "text-generation": {
        name: "Text Generation",
        subtasks: [
          {
            type: "dialogue-modeling",
            name: "Dialogue Modeling"
          },
          {
            type: "dialogue-generation",
            name: "Dialogue Generation"
          },
          {
            type: "conversational",
            name: "Conversational"
          },
          {
            type: "language-modeling",
            name: "Language Modeling"
          },
          {
            type: "text-simplification",
            name: "Text simplification"
          },
          {
            type: "explanation-generation",
            name: "Explanation Generation"
          },
          {
            type: "abstractive-qa",
            name: "Abstractive QA"
          },
          {
            type: "open-domain-abstractive-qa",
            name: "Open Domain Abstractive QA"
          },
          {
            type: "closed-domain-qa",
            name: "Closed Domain QA"
          },
          {
            type: "open-book-qa",
            name: "Open Book QA"
          },
          {
            type: "closed-book-qa",
            name: "Closed Book QA"
          },
          {
            type: "text2text-generation",
            name: "Text2Text Generation"
          }
        ],
        modality: "nlp"
      },
      "fill-mask": {
        name: "Fill-Mask",
        subtasks: [
          {
            type: "slot-filling",
            name: "Slot Filling"
          },
          {
            type: "masked-language-modeling",
            name: "Masked Language Modeling"
          }
        ],
        modality: "nlp"
      },
      "sentence-similarity": {
        name: "Sentence Similarity",
        modality: "nlp"
      },
      "text-to-speech": {
        name: "Text-to-Speech",
        modality: "audio"
      },
      "text-to-audio": {
        name: "Text-to-Audio",
        modality: "audio"
      },
      "automatic-speech-recognition": {
        name: "Automatic Speech Recognition",
        modality: "audio"
      },
      "audio-to-audio": {
        name: "Audio-to-Audio",
        modality: "audio"
      },
      "audio-classification": {
        name: "Audio Classification",
        subtasks: [
          {
            type: "keyword-spotting",
            name: "Keyword Spotting"
          },
          {
            type: "speaker-identification",
            name: "Speaker Identification"
          },
          {
            type: "audio-intent-classification",
            name: "Audio Intent Classification"
          },
          {
            type: "audio-emotion-recognition",
            name: "Audio Emotion Recognition"
          },
          {
            type: "audio-language-identification",
            name: "Audio Language Identification"
          }
        ],
        modality: "audio"
      },
      "audio-text-to-text": {
        name: "Audio-Text-to-Text",
        modality: "multimodal",
        hideInDatasets: true
      },
      "voice-activity-detection": {
        name: "Voice Activity Detection",
        modality: "audio"
      },
      "depth-estimation": {
        name: "Depth Estimation",
        modality: "cv"
      },
      "image-classification": {
        name: "Image Classification",
        subtasks: [
          {
            type: "multi-label-image-classification",
            name: "Multi Label Image Classification"
          },
          {
            type: "multi-class-image-classification",
            name: "Multi Class Image Classification"
          }
        ],
        modality: "cv"
      },
      "object-detection": {
        name: "Object Detection",
        subtasks: [
          {
            type: "face-detection",
            name: "Face Detection"
          },
          {
            type: "vehicle-detection",
            name: "Vehicle Detection"
          }
        ],
        modality: "cv"
      },
      "image-segmentation": {
        name: "Image Segmentation",
        subtasks: [
          {
            type: "instance-segmentation",
            name: "Instance Segmentation"
          },
          {
            type: "semantic-segmentation",
            name: "Semantic Segmentation"
          },
          {
            type: "panoptic-segmentation",
            name: "Panoptic Segmentation"
          }
        ],
        modality: "cv"
      },
      "text-to-image": {
        name: "Text-to-Image",
        modality: "cv"
      },
      "image-to-text": {
        name: "Image-to-Text",
        subtasks: [
          {
            type: "image-captioning",
            name: "Image Captioning"
          }
        ],
        modality: "cv"
      },
      "image-to-image": {
        name: "Image-to-Image",
        subtasks: [
          {
            type: "image-inpainting",
            name: "Image Inpainting"
          },
          {
            type: "image-colorization",
            name: "Image Colorization"
          },
          {
            type: "super-resolution",
            name: "Super Resolution"
          }
        ],
        modality: "cv"
      },
      "image-to-video": {
        name: "Image-to-Video",
        modality: "cv"
      },
      "unconditional-image-generation": {
        name: "Unconditional Image Generation",
        modality: "cv"
      },
      "video-classification": {
        name: "Video Classification",
        modality: "cv"
      },
      "reinforcement-learning": {
        name: "Reinforcement Learning",
        modality: "rl"
      },
      robotics: {
        name: "Robotics",
        modality: "rl",
        subtasks: [
          {
            type: "grasping",
            name: "Grasping"
          },
          {
            type: "task-planning",
            name: "Task Planning"
          }
        ]
      },
      "tabular-classification": {
        name: "Tabular Classification",
        modality: "tabular",
        subtasks: [
          {
            type: "tabular-multi-class-classification",
            name: "Tabular Multi Class Classification"
          },
          {
            type: "tabular-multi-label-classification",
            name: "Tabular Multi Label Classification"
          }
        ]
      },
      "tabular-regression": {
        name: "Tabular Regression",
        modality: "tabular",
        subtasks: [
          {
            type: "tabular-single-column-regression",
            name: "Tabular Single Column Regression"
          }
        ]
      },
      "tabular-to-text": {
        name: "Tabular to Text",
        modality: "tabular",
        subtasks: [
          {
            type: "rdf-to-text",
            name: "RDF to text"
          }
        ],
        hideInModels: true
      },
      "table-to-text": {
        name: "Table to Text",
        modality: "nlp",
        hideInModels: true
      },
      "multiple-choice": {
        name: "Multiple Choice",
        subtasks: [
          {
            type: "multiple-choice-qa",
            name: "Multiple Choice QA"
          },
          {
            type: "multiple-choice-coreference-resolution",
            name: "Multiple Choice Coreference Resolution"
          }
        ],
        modality: "nlp",
        hideInModels: true
      },
      "text-ranking": {
        name: "Text Ranking",
        modality: "nlp"
      },
      "text-retrieval": {
        name: "Text Retrieval",
        subtasks: [
          {
            type: "document-retrieval",
            name: "Document Retrieval"
          },
          {
            type: "utterance-retrieval",
            name: "Utterance Retrieval"
          },
          {
            type: "entity-linking-retrieval",
            name: "Entity Linking Retrieval"
          },
          {
            type: "fact-checking-retrieval",
            name: "Fact Checking Retrieval"
          }
        ],
        modality: "nlp",
        hideInModels: true
      },
      "time-series-forecasting": {
        name: "Time Series Forecasting",
        modality: "tabular",
        subtasks: [
          {
            type: "univariate-time-series-forecasting",
            name: "Univariate Time Series Forecasting"
          },
          {
            type: "multivariate-time-series-forecasting",
            name: "Multivariate Time Series Forecasting"
          }
        ]
      },
      "text-to-video": {
        name: "Text-to-Video",
        modality: "cv"
      },
      "image-text-to-text": {
        name: "Image-Text-to-Text",
        modality: "multimodal"
      },
      "image-text-to-image": {
        name: "Image-Text-to-Image",
        modality: "multimodal"
      },
      "image-text-to-video": {
        name: "Image-Text-to-Video",
        modality: "multimodal"
      },
      "visual-question-answering": {
        name: "Visual Question Answering",
        subtasks: [
          {
            type: "visual-question-answering",
            name: "Visual Question Answering"
          }
        ],
        modality: "multimodal"
      },
      "document-question-answering": {
        name: "Document Question Answering",
        subtasks: [
          {
            type: "document-question-answering",
            name: "Document Question Answering"
          }
        ],
        modality: "multimodal",
        hideInDatasets: true
      },
      "zero-shot-image-classification": {
        name: "Zero-Shot Image Classification",
        modality: "cv"
      },
      "graph-ml": {
        name: "Graph Machine Learning",
        modality: "other"
      },
      "mask-generation": {
        name: "Mask Generation",
        modality: "cv"
      },
      "zero-shot-object-detection": {
        name: "Zero-Shot Object Detection",
        modality: "cv"
      },
      "text-to-3d": {
        name: "Text-to-3D",
        modality: "cv"
      },
      "image-to-3d": {
        name: "Image-to-3D",
        modality: "cv"
      },
      "image-feature-extraction": {
        name: "Image Feature Extraction",
        modality: "cv"
      },
      "video-text-to-text": {
        name: "Video-Text-to-Text",
        modality: "multimodal",
        hideInDatasets: false
      },
      "keypoint-detection": {
        name: "Keypoint Detection",
        subtasks: [
          {
            type: "pose-estimation",
            name: "Pose Estimation"
          }
        ],
        modality: "cv",
        hideInDatasets: true
      },
      "visual-document-retrieval": {
        name: "Visual Document Retrieval",
        modality: "multimodal"
      },
      "any-to-any": {
        name: "Any-to-Any",
        modality: "multimodal"
      },
      "video-to-video": {
        name: "Video-to-Video",
        modality: "cv",
        hideInDatasets: true
      },
      other: {
        name: "Other",
        modality: "other",
        hideInModels: true,
        hideInDatasets: true
      }
    };
    exports2.PIPELINE_TYPES = Object.keys(exports2.PIPELINE_DATA);
    exports2.SUBTASK_TYPES = Object.values(exports2.PIPELINE_DATA).flatMap((data) => "subtasks" in data ? data.subtasks : []).map((s) => s.type);
    exports2.PIPELINE_TYPES_SET = new Set(exports2.PIPELINE_TYPES);
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/any-to-any/data.js
var require_data = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/any-to-any/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A dataset with multiple modality input and output pairs.",
          id: "PKU-Alignment/align-anything"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "any-to-any-input.jpg",
            type: "img"
          },
          {
            label: "Text Prompt",
            content: "What is the significance of this place?",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Generated Text",
            content: "The place in the picture is Osaka Castle, located in Osaka, Japan. Osaka Castle is a historic castle that was originally built in the 16th century by Toyotomi Hideyoshi, a powerful warlord of the time. It is one of the most famous landmarks in Osaka and is known for its distinctive white walls and black roof tiles. The castle has been rebuilt several times over the centuries and is now a popular tourist attraction, offering visitors a glimpse into Japan's rich history and culture.",
            type: "text"
          },
          {
            filename: "any-to-any-output.wav",
            type: "audio"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "Strong model that can take in video, audio, image, text and output text and natural speech.",
          id: "Qwen/Qwen2.5-Omni-7B"
        },
        {
          description: "Robust model that can take in image and text and generate image and text.",
          id: "OmniGen2/OmniGen2"
        },
        {
          description: "Any-to-any model with speech, video, audio, image and text understanding capabilities.",
          id: "openbmb/MiniCPM-o-2_6"
        },
        {
          description: "A model that can understand image and text and generate image and text.",
          id: "ByteDance-Seed/BAGEL-7B-MoT"
        }
      ],
      spaces: [
        {
          description: "An application to chat with an any-to-any (image & text) model.",
          id: "OmniGen2/OmniGen2"
        }
      ],
      summary: "Any-to-any models can understand two or more modalities and output two or more modalities.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/audio-classification/data.js
var require_data2 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/audio-classification/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A benchmark of 10 different audio tasks.",
          id: "s3prl/superb"
        },
        {
          description: "A dataset of YouTube clips and their sound categories.",
          id: "agkphysics/AudioSet"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "audio.wav",
            type: "audio"
          }
        ],
        outputs: [
          {
            data: [
              {
                label: "Up",
                score: 0.2
              },
              {
                label: "Down",
                score: 0.8
              }
            ],
            type: "chart"
          }
        ]
      },
      metrics: [
        {
          description: "",
          id: "accuracy"
        },
        {
          description: "",
          id: "recall"
        },
        {
          description: "",
          id: "precision"
        },
        {
          description: "",
          id: "f1"
        }
      ],
      models: [
        {
          description: "An easy-to-use model for command recognition.",
          id: "speechbrain/google_speech_command_xvector"
        },
        {
          description: "An emotion recognition model.",
          id: "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
        },
        {
          description: "A language identification model.",
          id: "facebook/mms-lid-126"
        }
      ],
      spaces: [
        {
          description: "An application that can classify music into different genre.",
          id: "kurianbenoy/audioclassification"
        }
      ],
      summary: "Audio classification is the task of assigning a label or class to a given audio. It can be used for recognizing which command a user is giving or the emotion of a statement, as well as identifying a speaker.",
      widgetModels: ["MIT/ast-finetuned-audioset-10-10-0.4593"],
      youtubeId: "KWwzcmG98Ds"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/audio-text-to-text/data.js
var require_data3 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/audio-text-to-text/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A dataset containing audio conversations with question\u2013answer pairs.",
          id: "nvidia/AF-Think"
        },
        {
          description: "A more advanced and comprehensive dataset that contains characteristics of the audio as well",
          id: "tsinghua-ee/QualiSpeech"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "audio.wav",
            type: "audio"
          },
          {
            label: "Text Prompt",
            content: "What is the gender of the speaker?",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Generated Text",
            content: "The gender of the speaker is female.",
            type: "text"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "A lightweight model that has capabilities of taking both audio and text as inputs and generating responses.",
          id: "fixie-ai/ultravox-v0_5-llama-3_2-1b"
        },
        {
          description: "A multimodal model that supports voice chat and audio analysis.",
          id: "Qwen/Qwen2-Audio-7B-Instruct"
        },
        {
          description: "A model for audio understanding, speech translation, and transcription.",
          id: "mistralai/Voxtral-Small-24B-2507"
        },
        {
          description: "A new model capable of audio question answering and reasoning.",
          id: "nvidia/audio-flamingo-3"
        }
      ],
      spaces: [
        {
          description: "A space that takes input as both audio and text and generates answers.",
          id: "iamomtiwari/ATTT"
        },
        {
          description: "A web application that demonstrates chatting with the Qwen2Audio Model.",
          id: "freddyaboulton/talk-to-qwen-webrtc"
        }
      ],
      summary: "Audio-text-to-text models take both an audio clip and a text prompt as input, and generate natural language text as output. These models can answer questions about spoken content, summarize meetings, analyze music, or interpret speech beyond simple transcription. They are useful for applications that combine speech understanding with reasoning or conversation.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/audio-to-audio/data.js
var require_data4 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/audio-to-audio/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "512-element X-vector embeddings of speakers from CMU ARCTIC dataset.",
          id: "Matthijs/cmu-arctic-xvectors"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "input.wav",
            type: "audio"
          }
        ],
        outputs: [
          {
            filename: "label-0.wav",
            type: "audio"
          },
          {
            filename: "label-1.wav",
            type: "audio"
          }
        ]
      },
      metrics: [
        {
          description: "The Signal-to-Noise ratio is the relationship between the target signal level and the background noise level. It is calculated as the logarithm of the target signal divided by the background noise, in decibels.",
          id: "snri"
        },
        {
          description: "The Signal-to-Distortion ratio is the relationship between the target signal and the sum of noise, interference, and artifact errors",
          id: "sdri"
        }
      ],
      models: [
        {
          description: "A speech enhancement model.",
          id: "ResembleAI/resemble-enhance"
        },
        {
          description: "A model that can change the voice in a speech recording.",
          id: "microsoft/speecht5_vc"
        }
      ],
      spaces: [
        {
          description: "An application for speech separation.",
          id: "younver/speechbrain-speech-separation"
        },
        {
          description: "An application for audio style transfer.",
          id: "nakas/audio-diffusion_style_transfer"
        }
      ],
      summary: "Audio-to-Audio is a family of tasks in which the input is an audio and the output is one or multiple generated audios. Some example tasks are speech enhancement and source separation.",
      widgetModels: ["speechbrain/sepformer-wham"],
      youtubeId: "iohj7nCCYoM"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/automatic-speech-recognition/data.js
var require_data5 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/automatic-speech-recognition/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "31,175 hours of multilingual audio-text dataset in 108 languages.",
          id: "mozilla-foundation/common_voice_17_0"
        },
        {
          description: "Multilingual and diverse audio dataset with 101k hours of audio.",
          id: "amphion/Emilia-Dataset"
        },
        {
          description: "A dataset with 44.6k hours of English speaker data and 6k hours of other language speakers.",
          id: "parler-tts/mls_eng"
        },
        {
          description: "A multilingual audio dataset with 370K hours of audio.",
          id: "espnet/yodas"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "input.flac",
            type: "audio"
          }
        ],
        outputs: [
          {
            /// GOING ALONG SLUSHY COUNTRY ROADS AND SPEAKING TO DAMP AUDIENCES I
            label: "Transcript",
            content: "Going along slushy country roads and speaking to damp audiences in...",
            type: "text"
          }
        ]
      },
      metrics: [
        {
          description: "",
          id: "wer"
        },
        {
          description: "",
          id: "cer"
        }
      ],
      models: [
        {
          description: "A powerful ASR model by OpenAI.",
          id: "openai/whisper-large-v3"
        },
        {
          description: "A good generic speech model by MetaAI for fine-tuning.",
          id: "facebook/w2v-bert-2.0"
        },
        {
          description: "An end-to-end model that performs ASR and Speech Translation by MetaAI.",
          id: "facebook/seamless-m4t-v2-large"
        },
        {
          description: "A powerful multilingual ASR and Speech Translation model by Nvidia.",
          id: "nvidia/canary-1b"
        },
        {
          description: "Powerful speaker diarization model.",
          id: "pyannote/speaker-diarization-3.1"
        }
      ],
      spaces: [
        {
          description: "A powerful general-purpose speech recognition application.",
          id: "hf-audio/whisper-large-v3"
        },
        {
          description: "Latest ASR model from Useful Sensors.",
          id: "mrfakename/Moonshinex"
        },
        {
          description: "A high quality speech and text translation model by Meta.",
          id: "facebook/seamless_m4t"
        },
        {
          description: "A powerful multilingual ASR and Speech Translation model by Nvidia",
          id: "nvidia/canary-1b"
        }
      ],
      summary: "Automatic Speech Recognition (ASR), also known as Speech to Text (STT), is the task of transcribing a given audio to text. It has many applications, such as voice user interfaces.",
      widgetModels: ["openai/whisper-large-v3"],
      youtubeId: "TksaY_FDgnk"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/document-question-answering/data.js
var require_data6 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/document-question-answering/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Largest document understanding dataset.",
          id: "HuggingFaceM4/Docmatix"
        },
        {
          description: "Dataset from the 2020 DocVQA challenge. The documents are taken from the UCSF Industry Documents Library.",
          id: "eliolio/docvqa"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Question",
            content: "What is the idea behind the consumer relations efficiency team?",
            type: "text"
          },
          {
            filename: "document-question-answering-input.png",
            type: "img"
          }
        ],
        outputs: [
          {
            label: "Answer",
            content: "Balance cost efficiency with quality customer service",
            type: "text"
          }
        ]
      },
      metrics: [
        {
          description: "The evaluation metric for the DocVQA challenge is the Average Normalized Levenshtein Similarity (ANLS). This metric is flexible to character regognition errors and compares the predicted answer with the ground truth answer.",
          id: "anls"
        },
        {
          description: "Exact Match is a metric based on the strict character match of the predicted answer and the right answer. For answers predicted correctly, the Exact Match will be 1. Even if only one character is different, Exact Match will be 0",
          id: "exact-match"
        }
      ],
      models: [
        {
          description: "A robust document question answering model.",
          id: "impira/layoutlm-document-qa"
        },
        {
          description: "A document question answering model specialized in invoices.",
          id: "impira/layoutlm-invoices"
        },
        {
          description: "A special model for OCR-free document question answering.",
          id: "microsoft/udop-large"
        },
        {
          description: "A powerful model for document question answering.",
          id: "google/pix2struct-docvqa-large"
        }
      ],
      spaces: [
        {
          description: "A robust document question answering application.",
          id: "impira/docquery"
        },
        {
          description: "An application that can answer questions from invoices.",
          id: "impira/invoices"
        },
        {
          description: "An application to compare different document question answering models.",
          id: "merve/compare_docvqa_models"
        }
      ],
      summary: "Document Question Answering (also known as Document Visual Question Answering) is the task of answering questions on document images. Document question answering models take a (document, question) pair as input and return an answer in natural language. Models usually rely on multi-modal features, combining text, position of words (bounding-boxes) and image.",
      widgetModels: ["impira/layoutlm-invoices"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/feature-extraction/data.js
var require_data7 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/feature-extraction/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Wikipedia dataset containing cleaned articles of all languages. Can be used to train `feature-extraction` models.",
          id: "wikipedia"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "India, officially the Republic of India, is a country in South Asia.",
            type: "text"
          }
        ],
        outputs: [
          {
            table: [
              ["Dimension 1", "Dimension 2", "Dimension 3"],
              ["2.583383083343506", "2.757075071334839", "0.9023529887199402"],
              ["8.29393482208252", "1.1071064472198486", "2.03399395942688"],
              ["-0.7754912972450256", "-1.647324562072754", "-0.6113331913948059"],
              ["0.07087723910808563", "1.5942802429199219", "1.4610432386398315"]
            ],
            type: "tabular"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "A powerful feature extraction model for natural language processing tasks.",
          id: "thenlper/gte-large"
        },
        {
          description: "A strong feature extraction model for retrieval.",
          id: "Alibaba-NLP/gte-Qwen1.5-7B-instruct"
        }
      ],
      spaces: [
        {
          description: "A leaderboard to rank text feature extraction models based on a benchmark.",
          id: "mteb/leaderboard"
        },
        {
          description: "A leaderboard to rank best feature extraction models based on human feedback.",
          id: "mteb/arena"
        }
      ],
      summary: "Feature extraction is the task of extracting features learnt in a model.",
      widgetModels: ["facebook/bart-base"]
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/fill-mask/data.js
var require_data8 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/fill-mask/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A common dataset that is used to train models for many languages.",
          id: "wikipedia"
        },
        {
          description: "A large English dataset with text crawled from the web.",
          id: "c4"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "The <mask> barked at me",
            type: "text"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "wolf",
                score: 0.487
              },
              {
                label: "dog",
                score: 0.061
              },
              {
                label: "cat",
                score: 0.058
              },
              {
                label: "fox",
                score: 0.047
              },
              {
                label: "squirrel",
                score: 0.025
              }
            ]
          }
        ]
      },
      metrics: [
        {
          description: "Cross Entropy is a metric that calculates the difference between two probability distributions. Each probability distribution is the distribution of predicted words",
          id: "cross_entropy"
        },
        {
          description: "Perplexity is the exponential of the cross-entropy loss. It evaluates the probabilities assigned to the next word by the model. Lower perplexity indicates better performance",
          id: "perplexity"
        }
      ],
      models: [
        {
          description: "State-of-the-art masked language model.",
          id: "answerdotai/ModernBERT-large"
        },
        {
          description: "A multilingual model trained on 100 languages.",
          id: "FacebookAI/xlm-roberta-base"
        }
      ],
      spaces: [],
      summary: "Masked language modeling is the task of masking some of the words in a sentence and predicting which words should replace those masks. These models are useful when we want to get a statistical understanding of the language in which the model is trained in.",
      widgetModels: ["distilroberta-base"],
      youtubeId: "mqElG5QJWUg"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-classification/data.js
var require_data9 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-classification/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          // TODO write proper description
          description: "Benchmark dataset used for image classification with images that belong to 100 classes.",
          id: "cifar100"
        },
        {
          // TODO write proper description
          description: "Dataset consisting of images of garments.",
          id: "fashion_mnist"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "image-classification-input.jpeg",
            type: "img"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "Egyptian cat",
                score: 0.514
              },
              {
                label: "Tabby cat",
                score: 0.193
              },
              {
                label: "Tiger cat",
                score: 0.068
              }
            ]
          }
        ]
      },
      metrics: [
        {
          description: "",
          id: "accuracy"
        },
        {
          description: "",
          id: "recall"
        },
        {
          description: "",
          id: "precision"
        },
        {
          description: "",
          id: "f1"
        }
      ],
      models: [
        {
          description: "A strong image classification model.",
          id: "google/vit-base-patch16-224"
        },
        {
          description: "A robust image classification model.",
          id: "facebook/deit-base-distilled-patch16-224"
        },
        {
          description: "A strong image classification model.",
          id: "facebook/convnext-large-224"
        }
      ],
      spaces: [
        {
          description: "A leaderboard to evaluate different image classification models.",
          id: "timm/leaderboard"
        }
      ],
      summary: "Image classification is the task of assigning a label or class to an entire image. Images are expected to have only one class for each image. Image classification models take an image as input and return a prediction about which class the image belongs to.",
      widgetModels: ["google/vit-base-patch16-224"],
      youtubeId: "tjAIM7BOYhw"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-feature-extraction/data.js
var require_data10 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-feature-extraction/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "ImageNet-1K is a image classification dataset in which images are used to train image-feature-extraction models.",
          id: "imagenet-1k"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "mask-generation-input.png",
            type: "img"
          }
        ],
        outputs: [
          {
            table: [
              ["Dimension 1", "Dimension 2", "Dimension 3"],
              ["0.21236686408519745", "1.0919708013534546", "0.8512550592422485"],
              ["0.809657871723175", "-0.18544459342956543", "-0.7851548194885254"],
              ["1.3103108406066895", "-0.2479034662246704", "-0.9107287526130676"],
              ["1.8536205291748047", "-0.36419737339019775", "0.09717650711536407"]
            ],
            type: "tabular"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "A powerful image feature extraction model.",
          id: "timm/vit_large_patch14_dinov2.lvd142m"
        },
        {
          description: "A strong image feature extraction model.",
          id: "nvidia/MambaVision-T-1K"
        },
        {
          description: "A robust image feature extraction model.",
          id: "facebook/dino-vitb16"
        },
        {
          description: "Cutting-edge image feature extraction model.",
          id: "apple/aimv2-large-patch14-336-distilled"
        },
        {
          description: "Strong image feature extraction model that can be used on images and documents.",
          id: "OpenGVLab/InternViT-6B-448px-V1-2"
        }
      ],
      spaces: [
        {
          description: "A leaderboard to evaluate different image-feature-extraction models on classification performances",
          id: "timm/leaderboard"
        }
      ],
      summary: "Image feature extraction is the task of extracting features learnt in a computer vision model.",
      widgetModels: []
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-to-image/data.js
var require_data11 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-to-image/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Synthetic dataset, for image relighting",
          id: "VIDIT"
        },
        {
          description: "Multiple images of celebrities, used for facial expression translation",
          id: "huggan/CelebA-faces"
        },
        {
          description: "12M image-caption pairs.",
          id: "Spawning/PD12M"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "image-to-image-input.jpeg",
            type: "img"
          }
        ],
        outputs: [
          {
            filename: "image-to-image-output.png",
            type: "img"
          }
        ]
      },
      isPlaceholder: false,
      metrics: [
        {
          description: "Peak Signal to Noise Ratio (PSNR) is an approximation of the human perception, considering the ratio of the absolute intensity with respect to the variations. Measured in dB, a high value indicates a high fidelity.",
          id: "PSNR"
        },
        {
          description: "Structural Similarity Index (SSIM) is a perceptual metric which compares the luminance, contrast and structure of two images. The values of SSIM range between -1 and 1, and higher values indicate closer resemblance to the original image.",
          id: "SSIM"
        },
        {
          description: "Inception Score (IS) is an analysis of the labels predicted by an image classification model when presented with a sample of the generated images.",
          id: "IS"
        }
      ],
      models: [
        {
          description: "An image-to-image model to improve image resolution.",
          id: "fal/AuraSR-v2"
        },
        {
          description: "Powerful image editing model.",
          id: "black-forest-labs/FLUX.1-Kontext-dev"
        },
        {
          description: "Virtual try-on model.",
          id: "yisol/IDM-VTON"
        },
        {
          description: "Image re-lighting model.",
          id: "kontext-community/relighting-kontext-dev-lora-v3"
        },
        {
          description: "Strong model for inpainting and outpainting.",
          id: "black-forest-labs/FLUX.1-Fill-dev"
        },
        {
          description: "Strong model for image editing using depth maps.",
          id: "black-forest-labs/FLUX.1-Depth-dev-lora"
        }
      ],
      spaces: [
        {
          description: "Image editing application.",
          id: "black-forest-labs/FLUX.1-Kontext-Dev"
        },
        {
          description: "Image relighting application.",
          id: "lllyasviel/iclight-v2-vary"
        },
        {
          description: "An application for image upscaling.",
          id: "jasperai/Flux.1-dev-Controlnet-Upscaler"
        }
      ],
      summary: "Image-to-image is the task of transforming an input image through a variety of possible manipulations and enhancements, such as super-resolution, image inpainting, colorization, and more.",
      widgetModels: ["Qwen/Qwen-Image"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-to-text/data.js
var require_data12 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-to-text/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          // TODO write proper description
          description: "Dataset from 12M image-text of Reddit",
          id: "red_caps"
        },
        {
          // TODO write proper description
          description: "Dataset from 3.3M images of Google",
          id: "datasets/conceptual_captions"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "savanna.jpg",
            type: "img"
          }
        ],
        outputs: [
          {
            label: "Detailed description",
            content: "a herd of giraffes and zebras grazing in a field",
            type: "text"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "Strong OCR model.",
          id: "allenai/olmOCR-7B-0725"
        },
        {
          description: "Powerful image captioning model.",
          id: "fancyfeast/llama-joycaption-beta-one-hf-llava"
        }
      ],
      spaces: [
        {
          description: "SVG generator app from images.",
          id: "multimodalart/OmniSVG-3B"
        },
        {
          description: "An application that converts documents to markdown.",
          id: "numind/NuMarkdown-8B-Thinking"
        },
        {
          description: "An application that can caption images.",
          id: "fancyfeast/joy-caption-beta-one"
        }
      ],
      summary: "Image to text models output a text from a given image. Image captioning or optical character recognition can be considered as the most common applications of image to text.",
      widgetModels: ["Salesforce/blip-image-captioning-large"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-text-to-text/data.js
var require_data13 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-text-to-text/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Instructions composed of image and text.",
          id: "liuhaotian/LLaVA-Instruct-150K"
        },
        {
          description: "Collection of image-text pairs on scientific topics.",
          id: "DAMO-NLP-SG/multimodal_textbook"
        },
        {
          description: "A collection of datasets made for model fine-tuning.",
          id: "HuggingFaceM4/the_cauldron"
        },
        {
          description: "Screenshots of websites with their HTML/CSS codes.",
          id: "HuggingFaceM4/WebSight"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "image-text-to-text-input.png",
            type: "img"
          },
          {
            label: "Text Prompt",
            content: "Describe the position of the bee in detail.",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Answer",
            content: "The bee is sitting on a pink flower, surrounded by other flowers. The bee is positioned in the center of the flower, with its head and front legs sticking out.",
            type: "text"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "Small and efficient yet powerful vision language model.",
          id: "HuggingFaceTB/SmolVLM-Instruct"
        },
        {
          description: "Cutting-edge reasoning vision language model.",
          id: "zai-org/GLM-4.5V"
        },
        {
          description: "Cutting-edge small vision language model to convert documents to text.",
          id: "rednote-hilab/dots.ocr"
        },
        {
          description: "Small yet powerful model.",
          id: "Qwen/Qwen2.5-VL-3B-Instruct"
        },
        {
          description: "Image-text-to-text model with agentic capabilities.",
          id: "microsoft/Magma-8B"
        }
      ],
      spaces: [
        {
          description: "Leaderboard to evaluate vision language models.",
          id: "opencompass/open_vlm_leaderboard"
        },
        {
          description: "An application that compares object detection capabilities of different vision language models.",
          id: "sergiopaniego/vlm_object_understanding"
        },
        {
          description: "An application to compare different OCR models.",
          id: "prithivMLmods/Multimodal-OCR"
        }
      ],
      summary: "Image-text-to-text models take in an image and text prompt and output text. These models are also called vision-language models, or VLMs. The difference from image-to-text models is that these models take an additional text input, not restricting the model to certain use cases like image captioning, and may also be trained to accept a conversation as input.",
      widgetModels: ["zai-org/GLM-4.5V"],
      youtubeId: "IoGaGfU1CIg"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-text-to-image/data.js
var require_data14 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-text-to-image/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [],
      demo: {
        inputs: [
          {
            filename: "image-text-to-image-input.jpeg",
            type: "img"
          },
          {
            label: "Input",
            content: "A city above clouds, pastel colors, Victorian style",
            type: "text"
          }
        ],
        outputs: [
          {
            filename: "image-text-to-image-output.png",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "The Fr\xE9chet Inception Distance (FID) calculates the distance between distributions between synthetic and real samples. A lower FID score indicates better similarity between the distributions of real and generated images.",
          id: "FID"
        },
        {
          description: "CLIP Score measures the similarity between the generated image and the text prompt using CLIP embeddings. A higher score indicates better alignment with the text prompt.",
          id: "CLIP"
        }
      ],
      models: [
        {
          description: "A powerful model for image-text-to-image generation.",
          id: "black-forest-labs/FLUX.2-dev"
        }
      ],
      spaces: [
        {
          description: "An application for image-text-to-image generation.",
          id: "black-forest-labs/FLUX.2-dev"
        }
      ],
      summary: "Image-text-to-image models take an image and a text prompt as input and generate a new image based on the reference image and text instructions. These models are useful for image editing, style transfer, image variations, and guided image generation tasks.",
      widgetModels: ["black-forest-labs/FLUX.2-dev"],
      youtubeId: void 0
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-text-to-video/data.js
var require_data15 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-text-to-video/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [],
      demo: {
        inputs: [
          {
            filename: "image-text-to-video-input.jpg",
            type: "img"
          },
          {
            label: "Input",
            content: "Darth Vader is surfing on the waves.",
            type: "text"
          }
        ],
        outputs: [
          {
            filename: "image-text-to-video-output.gif",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "Frechet Video Distance uses a model that captures coherence for changes in frames and the quality of each frame. A smaller score indicates better video generation.",
          id: "fvd"
        },
        {
          description: "CLIPSIM measures similarity between video frames and text using an image-text similarity model. A higher score indicates better video generation.",
          id: "clipsim"
        }
      ],
      models: [
        {
          description: "A powerful model for image-text-to-video generation.",
          id: "Lightricks/LTX-Video"
        }
      ],
      spaces: [
        {
          description: "An application for image-text-to-video generation.",
          id: "Lightricks/ltx-video-distilled"
        }
      ],
      summary: "Image-text-to-video models take an reference image and a text instructions as and generate a video based on them. These models are useful for animating still images, creating dynamic content from static references, and generating videos with specific motion or transformation guidance.",
      widgetModels: ["Lightricks/LTX-Video"],
      youtubeId: void 0
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-segmentation/data.js
var require_data16 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-segmentation/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Scene segmentation dataset.",
          id: "scene_parse_150"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "image-segmentation-input.jpeg",
            type: "img"
          }
        ],
        outputs: [
          {
            filename: "image-segmentation-output.png",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "Average Precision (AP) is the Area Under the PR Curve (AUC-PR). It is calculated for each semantic class separately",
          id: "Average Precision"
        },
        {
          description: "Mean Average Precision (mAP) is the overall average of the AP values",
          id: "Mean Average Precision"
        },
        {
          description: "Intersection over Union (IoU) is the overlap of segmentation masks. Mean IoU is the average of the IoU of all semantic classes",
          id: "Mean Intersection over Union"
        },
        {
          description: "AP\u03B1 is the Average Precision at the IoU threshold of a \u03B1 value, for example, AP50 and AP75",
          id: "AP\u03B1"
        }
      ],
      models: [
        {
          // TO DO: write description
          description: "Solid panoptic segmentation model trained on COCO.",
          id: "tue-mps/coco_panoptic_eomt_large_640"
        },
        {
          description: "Background removal model.",
          id: "briaai/RMBG-1.4"
        },
        {
          description: "A multipurpose image segmentation model for high resolution images.",
          id: "ZhengPeng7/BiRefNet"
        },
        {
          description: "Powerful human-centric image segmentation model.",
          id: "facebook/sapiens-seg-1b"
        },
        {
          description: "Panoptic segmentation model trained on the COCO (common objects) dataset.",
          id: "facebook/mask2former-swin-large-coco-panoptic"
        }
      ],
      spaces: [
        {
          description: "A semantic segmentation application that can predict unseen instances out of the box.",
          id: "facebook/ov-seg"
        },
        {
          description: "One of the strongest segmentation applications.",
          id: "jbrinkma/segment-anything"
        },
        {
          description: "A human-centric segmentation model.",
          id: "facebook/sapiens-pose"
        },
        {
          description: "An instance segmentation application to predict neuronal cell types from microscopy images.",
          id: "rashmi/sartorius-cell-instance-segmentation"
        },
        {
          description: "An application that segments videos.",
          id: "ArtGAN/Segment-Anything-Video"
        },
        {
          description: "An panoptic segmentation application built for outdoor environments.",
          id: "segments/panoptic-segment-anything"
        }
      ],
      summary: "Image Segmentation divides an image into segments where each pixel in the image is mapped to an object. This task has multiple variants such as instance segmentation, panoptic segmentation and semantic segmentation.",
      widgetModels: ["nvidia/segformer-b0-finetuned-ade-512-512"],
      youtubeId: "dKE8SIt9C-w"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-to-video/data.js
var require_data17 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-to-video/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A benchmark dataset for reference image controlled video generation.",
          id: "ali-vilab/VACE-Benchmark"
        },
        {
          description: "A dataset of video generation style preferences.",
          id: "Rapidata/sora-video-generation-style-likert-scoring"
        },
        {
          description: "A dataset with videos and captions throughout the videos.",
          id: "BestWishYsh/ChronoMagic"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "image-to-video-input.jpg",
            type: "img"
          },
          {
            label: "Optional Text Prompt",
            content: "This penguin is dancing",
            type: "text"
          }
        ],
        outputs: [
          {
            filename: "image-to-video-output.gif",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "Fr\xE9chet Video Distance (FVD) measures the perceptual similarity between the distributions of generated videos and a set of real videos, assessing overall visual quality and temporal coherence of the video generated from an input image.",
          id: "fvd"
        },
        {
          description: "CLIP Score measures the semantic similarity between a textual prompt (if provided alongside the input image) and the generated video frames. It evaluates how well the video's generated content and motion align with the textual description, conditioned on the initial image.",
          id: "clip_score"
        },
        {
          description: "First Frame Fidelity, often measured using LPIPS (Learned Perceptual Image Patch Similarity), PSNR, or SSIM, quantifies how closely the first frame of the generated video matches the input conditioning image.",
          id: "lpips"
        },
        {
          description: "Identity Preservation Score measures the consistency of identity (e.g., a person's face or a specific object's characteristics) between the input image and throughout the generated video frames, often calculated using features from specialized models like face recognition (e.g., ArcFace) or re-identification models.",
          id: "identity_preservation"
        },
        {
          description: "Motion Score evaluates the quality, realism, and temporal consistency of motion in the video generated from a static image. This can be based on optical flow analysis (e.g., smoothness, magnitude), consistency of object trajectories, or specific motion plausibility assessments.",
          id: "motion_score"
        }
      ],
      models: [
        {
          description: "LTX-Video, a 13B parameter model for high quality video generation",
          id: "Lightricks/LTX-Video-0.9.7-dev"
        },
        {
          description: "A 14B parameter model for reference image controlled video generation",
          id: "Wan-AI/Wan2.1-VACE-14B"
        },
        {
          description: "An image-to-video generation model using FramePack F1 methodology with Hunyuan-DiT architecture",
          id: "lllyasviel/FramePack_F1_I2V_HY_20250503"
        },
        {
          description: "A distilled version of the LTX-Video-0.9.7-dev model for faster inference",
          id: "Lightricks/LTX-Video-0.9.7-distilled"
        },
        {
          description: "An image-to-video generation model by Skywork AI, 14B parameters, producing 720p videos.",
          id: "Skywork/SkyReels-V2-I2V-14B-720P"
        },
        {
          description: "Image-to-video variant of Tencent's HunyuanVideo.",
          id: "tencent/HunyuanVideo-I2V"
        },
        {
          description: "A 14B parameter model for 720p image-to-video generation by Wan-AI.",
          id: "Wan-AI/Wan2.1-I2V-14B-720P"
        },
        {
          description: "A Diffusers version of the Wan2.1-I2V-14B-720P model for 720p image-to-video generation.",
          id: "Wan-AI/Wan2.1-I2V-14B-720P-Diffusers"
        }
      ],
      spaces: [
        {
          description: "An application to generate videos fast.",
          id: "Lightricks/ltx-video-distilled"
        },
        {
          description: "Generate videos with the FramePack-F1",
          id: "linoyts/FramePack-F1"
        },
        {
          description: "Generate videos with the FramePack",
          id: "lisonallen/framepack-i2v"
        },
        {
          description: "Wan2.1 with CausVid LoRA",
          id: "multimodalart/wan2-1-fast"
        },
        {
          description: "A demo for Stable Video Diffusion",
          id: "multimodalart/stable-video-diffusion"
        }
      ],
      summary: "Image-to-video models take a still image as input and generate a video. These models can be guided by text prompts to influence the content and style of the output video.",
      widgetModels: [],
      youtubeId: void 0
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/mask-generation/data.js
var require_data18 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/mask-generation/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Widely used benchmark dataset for multiple Vision tasks.",
          id: "merve/coco2017"
        },
        {
          description: "Medical Imaging dataset of the Human Brain for segmentation and mask generating tasks",
          id: "rocky93/BraTS_segmentation"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "mask-generation-input.png",
            type: "img"
          }
        ],
        outputs: [
          {
            filename: "mask-generation-output.png",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "IoU is used to measure the overlap between predicted mask and the ground truth mask.",
          id: "Intersection over Union (IoU)"
        }
      ],
      models: [
        {
          description: "Small yet powerful mask generation model.",
          id: "Zigeng/SlimSAM-uniform-50"
        },
        {
          description: "Very strong mask generation model.",
          id: "facebook/sam2-hiera-large"
        }
      ],
      spaces: [
        {
          description: "An application that combines a mask generation model with a zero-shot object detection model for text-guided image segmentation.",
          id: "merve/OWLSAM2"
        },
        {
          description: "An application that compares the performance of a large and a small mask generation model.",
          id: "merve/slimsam"
        },
        {
          description: "An application based on an improved mask generation model.",
          id: "SkalskiP/segment-anything-model-2"
        },
        {
          description: "An application to remove objects from videos using mask generation models.",
          id: "SkalskiP/SAM_and_ProPainter"
        }
      ],
      summary: "Mask generation is the task of generating masks that identify a specific object or region of interest in a given image. Masks are often used in segmentation tasks, where they provide a precise way to isolate the object of interest for further processing or analysis.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/object-detection/data.js
var require_data19 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/object-detection/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Widely used benchmark dataset for multiple vision tasks.",
          id: "merve/coco2017"
        },
        {
          description: "Multi-task computer vision benchmark.",
          id: "merve/pascal-voc"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "object-detection-input.jpg",
            type: "img"
          }
        ],
        outputs: [
          {
            filename: "object-detection-output.jpg",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "The Average Precision (AP) metric is the Area Under the PR Curve (AUC-PR). It is calculated for each class separately",
          id: "Average Precision"
        },
        {
          description: "The Mean Average Precision (mAP) metric is the overall average of the AP values",
          id: "Mean Average Precision"
        },
        {
          description: "The AP\u03B1 metric is the Average Precision at the IoU threshold of a \u03B1 value, for example, AP50 and AP75",
          id: "AP\u03B1"
        }
      ],
      models: [
        {
          description: "Solid object detection model pre-trained on the COCO 2017 dataset.",
          id: "facebook/detr-resnet-50"
        },
        {
          description: "Accurate object detection model.",
          id: "IDEA-Research/dab-detr-resnet-50"
        },
        {
          description: "Fast and accurate object detection model.",
          id: "PekingU/rtdetr_v2_r50vd"
        },
        {
          description: "Object detection model for low-lying objects.",
          id: "StephanST/WALDO30"
        }
      ],
      spaces: [
        {
          description: "Real-time object detection demo.",
          id: "Roboflow/RF-DETR"
        },
        {
          description: "An application that contains various object detection models to try from.",
          id: "Gradio-Blocks/Object-Detection-With-DETR-and-YOLOS"
        },
        {
          description: "A cutting-edge object detection application.",
          id: "sunsmarterjieleaf/yolov12"
        },
        {
          description: "An object tracking, segmentation and inpainting application.",
          id: "VIPLab/Track-Anything"
        },
        {
          description: "Very fast object tracking application based on object detection.",
          id: "merve/RT-DETR-tracking-coco"
        }
      ],
      summary: "Object Detection models allow users to identify objects of certain defined classes. Object detection models receive an image as input and output the images with bounding boxes and labels on detected objects.",
      widgetModels: ["facebook/detr-resnet-50"],
      youtubeId: "WdAeKSOpxhw"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/depth-estimation/data.js
var require_data20 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/depth-estimation/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "NYU Depth V2 Dataset: Video dataset containing both RGB and depth sensor data.",
          id: "sayakpaul/nyu_depth_v2"
        },
        {
          description: "Monocular depth estimation benchmark based without noise and errors.",
          id: "depth-anything/DA-2K"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "depth-estimation-input.jpg",
            type: "img"
          }
        ],
        outputs: [
          {
            filename: "depth-estimation-output.png",
            type: "img"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "Cutting-edge depth estimation model.",
          id: "depth-anything/Depth-Anything-V2-Large"
        },
        {
          description: "A strong monocular depth estimation model.",
          id: "jingheya/lotus-depth-g-v1-0"
        },
        {
          description: "A depth estimation model that predicts depth in videos.",
          id: "tencent/DepthCrafter"
        },
        {
          description: "A robust depth estimation model.",
          id: "apple/DepthPro-hf"
        }
      ],
      spaces: [
        {
          description: "An application that predicts the depth of an image and then reconstruct the 3D model as voxels.",
          id: "radames/dpt-depth-estimation-3d-voxels"
        },
        {
          description: "An application for bleeding-edge depth estimation.",
          id: "akhaliq/depth-pro"
        },
        {
          description: "An application on cutting-edge depth estimation in videos.",
          id: "tencent/DepthCrafter"
        },
        {
          description: "A human-centric depth estimation application.",
          id: "facebook/sapiens-depth"
        }
      ],
      summary: "Depth estimation is the task of predicting depth of the objects present in an image.",
      widgetModels: [""],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/placeholder/data.js
var require_data21 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/placeholder/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [],
      demo: {
        inputs: [],
        outputs: []
      },
      isPlaceholder: true,
      metrics: [],
      models: [],
      spaces: [],
      summary: "",
      widgetModels: [],
      youtubeId: void 0,
      /// If this is a subtask, link to the most general task ID
      /// (eg, text-generation is the canonical ID of text-simplification)
      canonicalId: void 0
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/reinforcement-learning/data.js
var require_data22 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/reinforcement-learning/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A curation of widely used datasets for Data Driven Deep Reinforcement Learning (D4RL)",
          id: "edbeeching/decision_transformer_gym_replay"
        }
      ],
      demo: {
        inputs: [
          {
            label: "State",
            content: "Red traffic light, pedestrians are about to pass.",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Action",
            content: "Stop the car.",
            type: "text"
          },
          {
            label: "Next State",
            content: "Yellow light, pedestrians have crossed.",
            type: "text"
          }
        ]
      },
      metrics: [
        {
          description: "Accumulated reward across all time steps discounted by a factor that ranges between 0 and 1 and determines how much the agent optimizes for future relative to immediate rewards. Measures how good is the policy ultimately found by a given algorithm considering uncertainty over the future.",
          id: "Discounted Total Reward"
        },
        {
          description: "Average return obtained after running the policy for a certain number of evaluation episodes. As opposed to total reward, mean reward considers how much reward a given algorithm receives while learning.",
          id: "Mean Reward"
        },
        {
          description: "Measures how good a given algorithm is after a predefined time. Some algorithms may be guaranteed to converge to optimal behavior across many time steps. However, an agent that reaches an acceptable level of optimality after a given time horizon may be preferable to one that ultimately reaches optimality but takes a long time.",
          id: "Level of Performance After Some Time"
        }
      ],
      models: [
        {
          description: "A Reinforcement Learning model trained on expert data from the Gym Hopper environment",
          id: "edbeeching/decision-transformer-gym-hopper-expert"
        },
        {
          description: "A PPO agent playing seals/CartPole-v0 using the stable-baselines3 library and the RL Zoo.",
          id: "HumanCompatibleAI/ppo-seals-CartPole-v0"
        }
      ],
      spaces: [
        {
          description: "An application for a cute puppy agent learning to catch a stick.",
          id: "ThomasSimonini/Huggy"
        },
        {
          description: "An application to play Snowball Fight with a reinforcement learning agent.",
          id: "ThomasSimonini/SnowballFight"
        }
      ],
      summary: "Reinforcement learning is the computational approach of learning from action by interacting with an environment through trial and error and receiving rewards (negative or positive) as feedback",
      widgetModels: [],
      youtubeId: "q0BiUn5LiBc"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/question-answering/data.js
var require_data23 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/question-answering/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          // TODO write proper description
          description: "A famous question answering dataset based on English articles from Wikipedia.",
          id: "squad_v2"
        },
        {
          // TODO write proper description
          description: "A dataset of aggregated anonymized actual queries issued to the Google search engine.",
          id: "natural_questions"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Question",
            content: "Which name is also used to describe the Amazon rainforest in English?",
            type: "text"
          },
          {
            label: "Context",
            content: "The Amazon rainforest, also known in English as Amazonia or the Amazon Jungle",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Answer",
            content: "Amazonia",
            type: "text"
          }
        ]
      },
      metrics: [
        {
          description: "Exact Match is a metric based on the strict character match of the predicted answer and the right answer. For answers predicted correctly, the Exact Match will be 1. Even if only one character is different, Exact Match will be 0",
          id: "exact-match"
        },
        {
          description: " The F1-Score metric is useful if we value both false positives and false negatives equally. The F1-Score is calculated on each word in the predicted sequence against the correct answer",
          id: "f1"
        }
      ],
      models: [
        {
          description: "A robust baseline model for most question answering domains.",
          id: "deepset/roberta-base-squad2"
        },
        {
          description: "Small yet robust model that can answer questions.",
          id: "distilbert/distilbert-base-cased-distilled-squad"
        },
        {
          description: "A special model that can answer questions from tables.",
          id: "google/tapas-base-finetuned-wtq"
        }
      ],
      spaces: [
        {
          description: "An application that can answer a long question from Wikipedia.",
          id: "deepset/wikipedia-assistant"
        }
      ],
      summary: "Question Answering models can retrieve the answer to a question from a given text, which is useful for searching for an answer in a document. Some question answering models can generate answers without context!",
      widgetModels: ["deepset/roberta-base-squad2"],
      youtubeId: "ajPx5LwJD-I"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/sentence-similarity/data.js
var require_data24 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/sentence-similarity/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Bing queries with relevant passages from various web sources.",
          id: "microsoft/ms_marco"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Source sentence",
            content: "Machine learning is so easy.",
            type: "text"
          },
          {
            label: "Sentences to compare to",
            content: "Deep learning is so straightforward.",
            type: "text"
          },
          {
            label: "",
            content: "This is so difficult, like rocket science.",
            type: "text"
          },
          {
            label: "",
            content: "I can't believe how much I struggled with this.",
            type: "text"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "Deep learning is so straightforward.",
                score: 0.623
              },
              {
                label: "This is so difficult, like rocket science.",
                score: 0.413
              },
              {
                label: "I can't believe how much I struggled with this.",
                score: 0.256
              }
            ]
          }
        ]
      },
      metrics: [
        {
          description: "Reciprocal Rank is a measure used to rank the relevancy of documents given a set of documents. Reciprocal Rank is the reciprocal of the rank of the document retrieved, meaning, if the rank is 3, the Reciprocal Rank is 0.33. If the rank is 1, the Reciprocal Rank is 1",
          id: "Mean Reciprocal Rank"
        },
        {
          description: "The similarity of the embeddings is evaluated mainly on cosine similarity. It is calculated as the cosine of the angle between two vectors. It is particularly useful when your texts are not the same length",
          id: "Cosine Similarity"
        }
      ],
      models: [
        {
          description: "This model works well for sentences and paragraphs and can be used for clustering/grouping and semantic searches.",
          id: "sentence-transformers/all-mpnet-base-v2"
        },
        {
          description: "A multilingual robust sentence similarity model.",
          id: "BAAI/bge-m3"
        },
        {
          description: "A robust sentence similarity model.",
          id: "HIT-TMG/KaLM-embedding-multilingual-mini-instruct-v1.5"
        }
      ],
      spaces: [
        {
          description: "An application that leverages sentence similarity to answer questions from YouTube videos.",
          id: "Gradio-Blocks/Ask_Questions_To_YouTube_Videos"
        },
        {
          description: "An application that retrieves relevant PubMed abstracts for a given online article which can be used as further references.",
          id: "Gradio-Blocks/pubmed-abstract-retriever"
        },
        {
          description: "An application that leverages sentence similarity to summarize text.",
          id: "nickmuchi/article-text-summarizer"
        },
        {
          description: "A guide that explains how Sentence Transformers can be used for semantic search.",
          id: "sentence-transformers/Sentence_Transformers_for_semantic_search"
        }
      ],
      summary: "Sentence Similarity is the task of determining how similar two texts are. Sentence similarity models convert input texts into vectors (embeddings) that capture semantic information and calculate how close (similar) they are between them. This task is particularly useful for information retrieval and clustering/grouping.",
      widgetModels: ["sentence-transformers/all-MiniLM-L6-v2"],
      youtubeId: "VCZq5AkbNEU"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/summarization/data.js
var require_data25 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/summarization/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      canonicalId: "text-generation",
      datasets: [
        {
          description: "News articles in five different languages along with their summaries. Widely used for benchmarking multilingual summarization models.",
          id: "mlsum"
        },
        {
          description: "English conversations and their summaries. Useful for benchmarking conversational agents.",
          id: "samsum"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. It was the first structure to reach a height of 300 metres. Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Output",
            content: "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building. It was the first structure to reach a height of 300 metres.",
            type: "text"
          }
        ]
      },
      metrics: [
        {
          description: "The generated sequence is compared against its summary, and the overlap of tokens are counted. ROUGE-N refers to overlap of N subsequent tokens, ROUGE-1 refers to overlap of single tokens and ROUGE-2 is the overlap of two subsequent tokens.",
          id: "rouge"
        }
      ],
      models: [
        {
          description: "A strong summarization model trained on English news articles. Excels at generating factual summaries.",
          id: "facebook/bart-large-cnn"
        },
        {
          description: "A summarization model trained on medical articles.",
          id: "Falconsai/medical_summarization"
        }
      ],
      spaces: [
        {
          description: "An application that can summarize long paragraphs.",
          id: "pszemraj/summarize-long-text"
        },
        {
          description: "A much needed summarization application for terms and conditions.",
          id: "ml6team/distilbart-tos-summarizer-tosdr"
        },
        {
          description: "An application that summarizes long documents.",
          id: "pszemraj/document-summarization"
        },
        {
          description: "An application that can detect errors in abstractive summarization.",
          id: "ml6team/post-processing-summarization"
        }
      ],
      summary: "Summarization is the task of producing a shorter version of a document while preserving its important information. Some models can extract text from the original input, while other models can generate entirely new text.",
      widgetModels: ["facebook/bart-large-cnn"],
      youtubeId: "yHnr5Dk2zCI"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/table-question-answering/data.js
var require_data26 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/table-question-answering/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "The WikiTableQuestions dataset is a large-scale dataset for the task of question answering on semi-structured tables.",
          id: "wikitablequestions"
        },
        {
          description: "WikiSQL is a dataset of 80654 hand-annotated examples of questions and SQL queries distributed across 24241 tables from Wikipedia.",
          id: "wikisql"
        }
      ],
      demo: {
        inputs: [
          {
            table: [
              ["Rank", "Name", "No.of reigns", "Combined days"],
              ["1", "lou Thesz", "3", "3749"],
              ["2", "Ric Flair", "8", "3103"],
              ["3", "Harley Race", "7", "1799"]
            ],
            type: "tabular"
          },
          { label: "Question", content: "What is the number of reigns for Harley Race?", type: "text" }
        ],
        outputs: [{ label: "Result", content: "7", type: "text" }]
      },
      metrics: [
        {
          description: "Checks whether the predicted answer(s) is the same as the ground-truth answer(s).",
          id: "Denotation Accuracy"
        }
      ],
      models: [
        {
          description: "A table question answering model that is capable of neural SQL execution, i.e., employ TAPEX to execute a SQL query on a given table.",
          id: "microsoft/tapex-base"
        },
        {
          description: "A robust table question answering model.",
          id: "google/tapas-base-finetuned-wtq"
        }
      ],
      spaces: [
        {
          description: "An application that answers questions based on table CSV files.",
          id: "katanaml/table-query"
        }
      ],
      summary: "Table Question Answering (Table QA) is the answering a question about an information on a given table.",
      widgetModels: ["google/tapas-base-finetuned-wtq"]
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/tabular-classification/data.js
var require_data27 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/tabular-classification/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A comprehensive curation of datasets covering all benchmarks.",
          id: "inria-soda/tabular-benchmark"
        }
      ],
      demo: {
        inputs: [
          {
            table: [
              ["Glucose", "Blood Pressure ", "Skin Thickness", "Insulin", "BMI"],
              ["148", "72", "35", "0", "33.6"],
              ["150", "50", "30", "0", "35.1"],
              ["141", "60", "29", "1", "39.2"]
            ],
            type: "tabular"
          }
        ],
        outputs: [
          {
            table: [["Diabetes"], ["1"], ["1"], ["0"]],
            type: "tabular"
          }
        ]
      },
      metrics: [
        {
          description: "",
          id: "accuracy"
        },
        {
          description: "",
          id: "recall"
        },
        {
          description: "",
          id: "precision"
        },
        {
          description: "",
          id: "f1"
        }
      ],
      models: [
        {
          description: "Breast cancer prediction model based on decision trees.",
          id: "scikit-learn/cancer-prediction-trees"
        }
      ],
      spaces: [
        {
          description: "An application that can predict defective products on a production line.",
          id: "scikit-learn/tabular-playground"
        },
        {
          description: "An application that compares various tabular classification techniques on different datasets.",
          id: "scikit-learn/classification"
        }
      ],
      summary: "Tabular classification is the task of classifying a target category (a group) based on set of attributes.",
      widgetModels: ["scikit-learn/tabular-playground"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/tabular-regression/data.js
var require_data28 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/tabular-regression/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A comprehensive curation of datasets covering all benchmarks.",
          id: "inria-soda/tabular-benchmark"
        }
      ],
      demo: {
        inputs: [
          {
            table: [
              ["Car Name", "Horsepower", "Weight"],
              ["ford torino", "140", "3,449"],
              ["amc hornet", "97", "2,774"],
              ["toyota corolla", "65", "1,773"]
            ],
            type: "tabular"
          }
        ],
        outputs: [
          {
            table: [["MPG (miles per gallon)"], ["17"], ["18"], ["31"]],
            type: "tabular"
          }
        ]
      },
      metrics: [
        {
          description: "",
          id: "mse"
        },
        {
          description: "Coefficient of determination (or R-squared) is a measure of how well the model fits the data. Higher R-squared is considered a better fit.",
          id: "r-squared"
        }
      ],
      models: [
        {
          description: "Fish weight prediction based on length measurements and species.",
          id: "scikit-learn/Fish-Weight"
        }
      ],
      spaces: [
        {
          description: "An application that can predict weight of a fish based on set of attributes.",
          id: "scikit-learn/fish-weight-prediction"
        }
      ],
      summary: "Tabular regression is the task of predicting a numerical value given a set of attributes.",
      widgetModels: ["scikit-learn/Fish-Weight"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/text-to-image/data.js
var require_data29 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/text-to-image/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "RedCaps is a large-scale dataset of 12M image-text pairs collected from Reddit.",
          id: "red_caps"
        },
        {
          description: "Conceptual Captions is a dataset consisting of ~3.3M images annotated with captions.",
          id: "conceptual_captions"
        },
        {
          description: "12M image-caption pairs.",
          id: "Spawning/PD12M"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "A city above clouds, pastel colors, Victorian style",
            type: "text"
          }
        ],
        outputs: [
          {
            filename: "image.jpeg",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "The Inception Score (IS) measure assesses diversity and meaningfulness. It uses a generated image sample to predict its label. A higher score signifies more diverse and meaningful images.",
          id: "IS"
        },
        {
          description: "The Fr\xE9chet Inception Distance (FID) calculates the distance between distributions between synthetic and real samples. A lower FID score indicates better similarity between the distributions of real and generated images.",
          id: "FID"
        },
        {
          description: "R-precision assesses how the generated image aligns with the provided text description. It uses the generated images as queries to retrieve relevant text descriptions. The top 'r' relevant descriptions are selected and used to calculate R-precision as r/R, where 'R' is the number of ground truth descriptions associated with the generated images. A higher R-precision value indicates a better model.",
          id: "R-Precision"
        }
      ],
      models: [
        {
          description: "One of the most powerful image generation models that can generate realistic outputs.",
          id: "black-forest-labs/FLUX.1-Krea-dev"
        },
        {
          description: "A powerful image generation model.",
          id: "Qwen/Qwen-Image"
        },
        {
          description: "Powerful and fast image generation model.",
          id: "ByteDance/SDXL-Lightning"
        },
        {
          description: "A powerful text-to-image model.",
          id: "ByteDance/Hyper-SD"
        }
      ],
      spaces: [
        {
          description: "A powerful text-to-image application.",
          id: "stabilityai/stable-diffusion-3-medium"
        },
        {
          description: "A text-to-image application to generate comics.",
          id: "jbilcke-hf/ai-comic-factory"
        },
        {
          description: "An application to match multiple custom image generation models.",
          id: "multimodalart/flux-lora-lab"
        },
        {
          description: "A powerful yet very fast image generation application.",
          id: "latent-consistency/lcm-lora-for-sdxl"
        },
        {
          description: "A gallery to explore various text-to-image models.",
          id: "multimodalart/LoraTheExplorer"
        },
        {
          description: "An application for `text-to-image`, `image-to-image` and image inpainting.",
          id: "ArtGAN/Stable-Diffusion-ControlNet-WebUI"
        },
        {
          description: "An application to generate realistic images given photos of a person and a prompt.",
          id: "InstantX/InstantID"
        }
      ],
      summary: "Text-to-image is the task of generating images from input text. These pipelines can also be used to modify and edit images based on text prompts.",
      widgetModels: ["black-forest-labs/FLUX.1-dev"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/text-to-speech/data.js
var require_data30 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/text-to-speech/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      canonicalId: "text-to-audio",
      datasets: [
        {
          description: "10K hours of multi-speaker English dataset.",
          id: "parler-tts/mls_eng_10k"
        },
        {
          description: "Multi-speaker English dataset.",
          id: "mythicinfinity/libritts_r"
        },
        {
          description: "Multi-lingual dataset.",
          id: "facebook/multilingual_librispeech"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "I love audio models on the Hub!",
            type: "text"
          }
        ],
        outputs: [
          {
            filename: "audio.wav",
            type: "audio"
          }
        ]
      },
      metrics: [
        {
          description: "The Mel Cepstral Distortion (MCD) metric is used to calculate the quality of generated speech.",
          id: "mel cepstral distortion"
        }
      ],
      models: [
        {
          description: "Small yet powerful TTS model.",
          id: "KittenML/kitten-tts-nano-0.1"
        },
        {
          description: "Bleeding edge TTS model.",
          id: "ResembleAI/chatterbox"
        },
        {
          description: "A massively multi-lingual TTS model.",
          id: "fishaudio/fish-speech-1.5"
        },
        {
          description: "A text-to-dialogue model.",
          id: "nari-labs/Dia-1.6B-0626"
        }
      ],
      spaces: [
        {
          description: "An application for generate high quality speech in different languages.",
          id: "hexgrad/Kokoro-TTS"
        },
        {
          description: "A multilingual text-to-speech application.",
          id: "fishaudio/fish-speech-1"
        },
        {
          description: "Performant TTS application.",
          id: "ResembleAI/Chatterbox"
        },
        {
          description: "An application to compare different TTS models.",
          id: "TTS-AGI/TTS-Arena-V2"
        },
        {
          description: "An application that generates podcast episodes.",
          id: "ngxson/kokoro-podcast-generator"
        }
      ],
      summary: "Text-to-Speech (TTS) is the task of generating natural sounding speech given text input. TTS models can be extended to have a single model that generates speech for multiple speakers and multiple languages.",
      widgetModels: ["suno/bark"],
      youtubeId: "NW62DpzJ274"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/token-classification/data.js
var require_data31 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/token-classification/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A widely used dataset useful to benchmark named entity recognition models.",
          id: "eriktks/conll2003"
        },
        {
          description: "A multilingual dataset of Wikipedia articles annotated for named entity recognition in over 150 different languages.",
          id: "unimelb-nlp/wikiann"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "My name is Omar and I live in Z\xFCrich.",
            type: "text"
          }
        ],
        outputs: [
          {
            text: "My name is Omar and I live in Z\xFCrich.",
            tokens: [
              {
                type: "PERSON",
                start: 11,
                end: 15
              },
              {
                type: "GPE",
                start: 30,
                end: 36
              }
            ],
            type: "text-with-tokens"
          }
        ]
      },
      metrics: [
        {
          description: "",
          id: "accuracy"
        },
        {
          description: "",
          id: "recall"
        },
        {
          description: "",
          id: "precision"
        },
        {
          description: "",
          id: "f1"
        }
      ],
      models: [
        {
          description: "A robust performance model to identify people, locations, organizations and names of miscellaneous entities.",
          id: "dslim/bert-base-NER"
        },
        {
          description: "A strong model to identify people, locations, organizations and names in multiple languages.",
          id: "FacebookAI/xlm-roberta-large-finetuned-conll03-english"
        },
        {
          description: "A token classification model specialized on medical entity recognition.",
          id: "blaze999/Medical-NER"
        },
        {
          description: "Flair models are typically the state of the art in named entity recognition tasks.",
          id: "flair/ner-english"
        }
      ],
      spaces: [
        {
          description: "An application that can recognizes entities, extracts noun chunks and recognizes various linguistic features of each token.",
          id: "spacy/gradio_pipeline_visualizer"
        }
      ],
      summary: "Token classification is a natural language understanding task in which a label is assigned to some tokens in a text. Some popular token classification subtasks are Named Entity Recognition (NER) and Part-of-Speech (PoS) tagging. NER models could be trained to identify specific entities in a text, such as dates, individuals and places; and PoS tagging would identify, for example, which words in a text are verbs, nouns, and punctuation marks.",
      widgetModels: ["FacebookAI/xlm-roberta-large-finetuned-conll03-english"],
      youtubeId: "wVHdVlPScxA"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/translation/data.js
var require_data32 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/translation/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      canonicalId: "text-generation",
      datasets: [
        {
          description: "A dataset of copyright-free books translated into 16 different languages.",
          id: "Helsinki-NLP/opus_books"
        },
        {
          description: "An example of translation between programming languages. This dataset consists of functions in Java and C#.",
          id: "google/code_x_glue_cc_code_to_code_trans"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "My name is Omar and I live in Z\xFCrich.",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Output",
            content: "Mein Name ist Omar und ich wohne in Z\xFCrich.",
            type: "text"
          }
        ]
      },
      metrics: [
        {
          description: "BLEU score is calculated by counting the number of shared single or subsequent tokens between the generated sequence and the reference. Subsequent n tokens are called \u201Cn-grams\u201D. Unigram refers to a single token while bi-gram refers to token pairs and n-grams refer to n subsequent tokens. The score ranges from 0 to 1, where 1 means the translation perfectly matched and 0 did not match at all",
          id: "bleu"
        },
        {
          description: "",
          id: "sacrebleu"
        }
      ],
      models: [
        {
          description: "Very powerful model that can translate many languages between each other, especially low-resource languages.",
          id: "facebook/nllb-200-1.3B"
        },
        {
          description: "A general-purpose Transformer that can be used to translate from English to German, French, or Romanian.",
          id: "google-t5/t5-base"
        }
      ],
      spaces: [
        {
          description: "An application that can translate between 100 languages.",
          id: "Iker/Translate-100-languages"
        },
        {
          description: "An application that can translate between many languages.",
          id: "Geonmo/nllb-translation-demo"
        }
      ],
      summary: "Translation is the task of converting text from one language to another.",
      widgetModels: ["facebook/mbart-large-50-many-to-many-mmt"],
      youtubeId: "1JvfrvZgi6c"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/text-classification/data.js
var require_data33 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/text-classification/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A widely used dataset used to benchmark multiple variants of text classification.",
          id: "nyu-mll/glue"
        },
        {
          description: "A text classification dataset used to benchmark natural language inference models",
          id: "stanfordnlp/snli"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "I love Hugging Face!",
            type: "text"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "POSITIVE",
                score: 0.9
              },
              {
                label: "NEUTRAL",
                score: 0.1
              },
              {
                label: "NEGATIVE",
                score: 0
              }
            ]
          }
        ]
      },
      metrics: [
        {
          description: "",
          id: "accuracy"
        },
        {
          description: "",
          id: "recall"
        },
        {
          description: "",
          id: "precision"
        },
        {
          description: "The F1 metric is the harmonic mean of the precision and recall. It can be calculated as: F1 = 2 * (precision * recall) / (precision + recall)",
          id: "f1"
        }
      ],
      models: [
        {
          description: "A robust model trained for sentiment analysis.",
          id: "distilbert/distilbert-base-uncased-finetuned-sst-2-english"
        },
        {
          description: "A sentiment analysis model specialized in financial sentiment.",
          id: "ProsusAI/finbert"
        },
        {
          description: "A sentiment analysis model specialized in analyzing tweets.",
          id: "cardiffnlp/twitter-roberta-base-sentiment-latest"
        },
        {
          description: "A model that can classify languages.",
          id: "papluca/xlm-roberta-base-language-detection"
        },
        {
          description: "A model that can classify text generation attacks.",
          id: "meta-llama/Prompt-Guard-86M"
        }
      ],
      spaces: [
        {
          description: "An application that can classify financial sentiment.",
          id: "IoannisTr/Tech_Stocks_Trading_Assistant"
        },
        {
          description: "A dashboard that contains various text classification tasks.",
          id: "miesnerjacob/Multi-task-NLP"
        },
        {
          description: "An application that analyzes user reviews in healthcare.",
          id: "spacy/healthsea-demo"
        }
      ],
      summary: "Text Classification is the task of assigning a label or class to a given text. Some use cases are sentiment analysis, natural language inference, and assessing grammatical correctness.",
      widgetModels: ["distilbert/distilbert-base-uncased-finetuned-sst-2-english"],
      youtubeId: "leNG9fN9FQU"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/text-generation/data.js
var require_data34 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/text-generation/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Multilingual dataset used to evaluate text generation models.",
          id: "CohereForAI/Global-MMLU"
        },
        {
          description: "High quality multilingual data used to train text-generation models.",
          id: "HuggingFaceFW/fineweb-2"
        },
        {
          description: "Truly open-source, curated and cleaned dialogue dataset.",
          id: "HuggingFaceH4/ultrachat_200k"
        },
        {
          description: "A reasoning dataset.",
          id: "open-r1/OpenThoughts-114k-math"
        },
        {
          description: "A multilingual instruction dataset with preference ratings on responses.",
          id: "allenai/tulu-3-sft-mixture"
        },
        {
          description: "A large synthetic dataset for alignment of text generation models.",
          id: "HuggingFaceTB/smoltalk"
        },
        {
          description: "A dataset made for training text generation models solving math questions.",
          id: "HuggingFaceTB/finemath"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "Once upon a time,",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Output",
            content: "Once upon a time, we knew that our ancestors were on the verge of extinction. The great explorers and poets of the Old World, from Alexander the Great to Chaucer, are dead and gone. A good many of our ancient explorers and poets have",
            type: "text"
          }
        ]
      },
      metrics: [
        {
          description: "Cross Entropy is a metric that calculates the difference between two probability distributions. Each probability distribution is the distribution of predicted words",
          id: "Cross Entropy"
        },
        {
          description: "The Perplexity metric is the exponential of the cross-entropy loss. It evaluates the probabilities assigned to the next word by the model. Lower perplexity indicates better performance",
          id: "Perplexity"
        }
      ],
      models: [
        { description: "A text-generation model trained to follow instructions.", id: "google/gemma-2-2b-it" },
        {
          description: "Powerful text generation model for coding.",
          id: "Qwen/Qwen3-Coder-480B-A35B-Instruct"
        },
        {
          description: "Great text generation model with top-notch tool calling capabilities.",
          id: "openai/gpt-oss-120b"
        },
        {
          description: "Powerful text generation model.",
          id: "zai-org/GLM-4.5"
        },
        {
          description: "A powerful small model with reasoning capabilities.",
          id: "Qwen/Qwen3-4B-Thinking-2507"
        },
        {
          description: "Strong conversational model that supports very long instructions.",
          id: "Qwen/Qwen2.5-7B-Instruct-1M"
        },
        {
          description: "Text generation model used to write code.",
          id: "Qwen/Qwen2.5-Coder-32B-Instruct"
        },
        {
          description: "Powerful reasoning based open large language model.",
          id: "deepseek-ai/DeepSeek-R1"
        }
      ],
      spaces: [
        {
          description: "An application that writes and executes code from text instructions and supports many models.",
          id: "akhaliq/anycoder"
        },
        {
          description: "An application that builds websites from natural language prompts.",
          id: "enzostvs/deepsite"
        },
        {
          description: "A leaderboard for comparing chain-of-thought performance of models.",
          id: "logikon/open_cot_leaderboard"
        },
        {
          description: "An text generation based application based on a very powerful LLaMA2 model.",
          id: "ysharma/Explore_llamav2_with_TGI"
        },
        {
          description: "An text generation based application to converse with Zephyr model.",
          id: "HuggingFaceH4/zephyr-chat"
        },
        {
          description: "A leaderboard that ranks text generation models based on blind votes from people.",
          id: "lmsys/chatbot-arena-leaderboard"
        },
        {
          description: "An chatbot to converse with a very powerful text generation model.",
          id: "mlabonne/phixtral-chat"
        }
      ],
      summary: "Generating text is the task of generating new text given another text. These models can, for example, fill in incomplete text or paraphrase.",
      widgetModels: ["mistralai/Mistral-Nemo-Instruct-2407"],
      youtubeId: "e9gNEAlsOvU"
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/text-ranking/data.js
var require_data35 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/text-ranking/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Bing queries with relevant passages from various web sources.",
          id: "microsoft/ms_marco"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Source sentence",
            content: "Machine learning is so easy.",
            type: "text"
          },
          {
            label: "Sentences to compare to",
            content: "Deep learning is so straightforward.",
            type: "text"
          },
          {
            label: "",
            content: "This is so difficult, like rocket science.",
            type: "text"
          },
          {
            label: "",
            content: "I can't believe how much I struggled with this.",
            type: "text"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "Deep learning is so straightforward.",
                score: 2.2006407
              },
              {
                label: "This is so difficult, like rocket science.",
                score: -6.2634873
              },
              {
                label: "I can't believe how much I struggled with this.",
                score: -10.251488
              }
            ]
          }
        ]
      },
      metrics: [
        {
          description: "Discounted Cumulative Gain (DCG) measures the gain, or usefulness, of search results discounted by their position. The normalization is done by dividing the DCG by the ideal DCG, which is the DCG of the perfect ranking.",
          id: "Normalized Discounted Cumulative Gain"
        },
        {
          description: "Reciprocal Rank is a measure used to rank the relevancy of documents given a set of documents. Reciprocal Rank is the reciprocal of the rank of the document retrieved, meaning, if the rank is 3, the Reciprocal Rank is 0.33. If the rank is 1, the Reciprocal Rank is 1",
          id: "Mean Reciprocal Rank"
        },
        {
          description: "Mean Average Precision (mAP) is the overall average of the Average Precision (AP) values, where AP is the Area Under the PR Curve (AUC-PR)",
          id: "Mean Average Precision"
        }
      ],
      models: [
        {
          description: "An extremely efficient text ranking model trained on a web search dataset.",
          id: "cross-encoder/ms-marco-MiniLM-L6-v2"
        },
        {
          description: "A strong multilingual text reranker model.",
          id: "Alibaba-NLP/gte-multilingual-reranker-base"
        },
        {
          description: "An efficient text ranking model that punches above its weight.",
          id: "Alibaba-NLP/gte-reranker-modernbert-base"
        }
      ],
      spaces: [],
      summary: "Text Ranking is the task of ranking a set of texts based on their relevance to a query. Text ranking models are trained on large datasets of queries and relevant documents to learn how to rank documents based on their relevance to the query. This task is particularly useful for search engines and information retrieval systems.",
      widgetModels: ["cross-encoder/ms-marco-MiniLM-L6-v2"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/text-to-video/data.js
var require_data36 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/text-to-video/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Microsoft Research Video to Text is a large-scale dataset for open domain video captioning",
          id: "iejMac/CLIP-MSR-VTT"
        },
        {
          description: "UCF101 Human Actions dataset consists of 13,320 video clips from YouTube, with 101 classes.",
          id: "quchenyuan/UCF101-ZIP"
        },
        {
          description: "A high-quality dataset for human action recognition in YouTube videos.",
          id: "nateraw/kinetics"
        },
        {
          description: "A dataset of video clips of humans performing pre-defined basic actions with everyday objects.",
          id: "HuggingFaceM4/something_something_v2"
        },
        {
          description: "This dataset consists of text-video pairs and contains noisy samples with irrelevant video descriptions",
          id: "HuggingFaceM4/webvid"
        },
        {
          description: "A dataset of short Flickr videos for the temporal localization of events with descriptions.",
          id: "iejMac/CLIP-DiDeMo"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Input",
            content: "Darth Vader is surfing on the waves.",
            type: "text"
          }
        ],
        outputs: [
          {
            filename: "text-to-video-output.gif",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "Inception Score uses an image classification model that predicts class labels and evaluates how distinct and diverse the images are. A higher score indicates better video generation.",
          id: "is"
        },
        {
          description: "Frechet Inception Distance uses an image classification model to obtain image embeddings. The metric compares mean and standard deviation of the embeddings of real and generated images. A smaller score indicates better video generation.",
          id: "fid"
        },
        {
          description: "Frechet Video Distance uses a model that captures coherence for changes in frames and the quality of each frame. A smaller score indicates better video generation.",
          id: "fvd"
        },
        {
          description: "CLIPSIM measures similarity between video frames and text using an image-text similarity model. A higher score indicates better video generation.",
          id: "clipsim"
        }
      ],
      models: [
        {
          description: "A strong model for consistent video generation.",
          id: "tencent/HunyuanVideo"
        },
        {
          description: "A text-to-video model with high fidelity motion and strong prompt adherence.",
          id: "Lightricks/LTX-Video"
        },
        {
          description: "A text-to-video model focusing on physics-aware applications like robotics.",
          id: "nvidia/Cosmos-1.0-Diffusion-7B-Text2World"
        },
        {
          description: "Very fast model for video generation.",
          id: "Lightricks/LTX-Video-0.9.8-13B-distilled"
        }
      ],
      spaces: [
        {
          description: "An application that generates video from text.",
          id: "VideoCrafter/VideoCrafter"
        },
        {
          description: "Consistent video generation application.",
          id: "Wan-AI/Wan2.1"
        },
        {
          description: "A cutting edge video generation application.",
          id: "Pyramid-Flow/pyramid-flow"
        }
      ],
      summary: "Text-to-video models can be used in any application that requires generating consistent sequence of images from text. ",
      widgetModels: ["Wan-AI/Wan2.2-TI2V-5B"],
      youtubeId: void 0
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/unconditional-image-generation/data.js
var require_data37 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/unconditional-image-generation/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "The CIFAR-100 dataset consists of 60000 32x32 colour images in 100 classes, with 600 images per class.",
          id: "cifar100"
        },
        {
          description: "Multiple images of celebrities, used for facial expression translation.",
          id: "CelebA"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Seed",
            content: "42",
            type: "text"
          },
          {
            label: "Number of images to generate:",
            content: "4",
            type: "text"
          }
        ],
        outputs: [
          {
            filename: "unconditional-image-generation-output.jpeg",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "The inception score (IS) evaluates the quality of generated images. It measures the diversity of the generated images (the model predictions are evenly distributed across all possible labels) and their 'distinction' or 'sharpness' (the model confidently predicts a single label for each image).",
          id: "Inception score (IS)"
        },
        {
          description: "The Fr\xE9chet Inception Distance (FID) evaluates the quality of images created by a generative model by calculating the distance between feature vectors for real and generated images.",
          id: "Fre\u0107het Inception Distance (FID)"
        }
      ],
      models: [
        {
          description: "High-quality image generation model trained on the CIFAR-10 dataset. It synthesizes images of the ten classes presented in the dataset using diffusion probabilistic models, a class of latent variable models inspired by considerations from nonequilibrium thermodynamics.",
          id: "google/ddpm-cifar10-32"
        },
        {
          description: "High-quality image generation model trained on the 256x256 CelebA-HQ dataset. It synthesizes images of faces using diffusion probabilistic models, a class of latent variable models inspired by considerations from nonequilibrium thermodynamics.",
          id: "google/ddpm-celebahq-256"
        }
      ],
      spaces: [
        {
          description: "An application that can generate realistic faces.",
          id: "CompVis/celeba-latent-diffusion"
        }
      ],
      summary: "Unconditional image generation is the task of generating images with no condition in any context (like a prompt text or another image). Once trained, the model will create images that resemble its training data distribution.",
      widgetModels: [""],
      // TODO: Add related video
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/video-classification/data.js
var require_data38 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/video-classification/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          // TODO write proper description
          description: "Benchmark dataset used for video classification with videos that belong to 400 classes.",
          id: "kinetics400"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "video-classification-input.gif",
            type: "img"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "Playing Guitar",
                score: 0.514
              },
              {
                label: "Playing Tennis",
                score: 0.193
              },
              {
                label: "Cooking",
                score: 0.068
              }
            ]
          }
        ]
      },
      metrics: [
        {
          description: "",
          id: "accuracy"
        },
        {
          description: "",
          id: "recall"
        },
        {
          description: "",
          id: "precision"
        },
        {
          description: "",
          id: "f1"
        }
      ],
      models: [
        {
          // TO DO: write description
          description: "Strong Video Classification model trained on the Kinetics 400 dataset.",
          id: "google/vivit-b-16x2-kinetics400"
        },
        {
          // TO DO: write description
          description: "Strong Video Classification model trained on the Kinetics 400 dataset.",
          id: "microsoft/xclip-base-patch32"
        }
      ],
      spaces: [
        {
          description: "An application that classifies video at different timestamps.",
          id: "nateraw/lavila"
        },
        {
          description: "An application that classifies video.",
          id: "fcakyon/video-classification"
        }
      ],
      summary: "Video classification is the task of assigning a label or class to an entire video. Videos are expected to have only one class for each video. Video classification models take a video as input and return a prediction about which class the video belongs to.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/visual-document-retrieval/data.js
var require_data39 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/visual-document-retrieval/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A large dataset used to train visual document retrieval models.",
          id: "vidore/colpali_train_set"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "input.png",
            type: "img"
          },
          {
            label: "Question",
            content: "Is the model in this paper the fastest for inference?",
            type: "text"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "Page 10",
                score: 0.7
              },
              {
                label: "Page 11",
                score: 0.06
              },
              {
                label: "Page 9",
                score: 3e-3
              }
            ]
          }
        ]
      },
      isPlaceholder: false,
      metrics: [
        {
          description: "NDCG@k scores ranked recommendation lists for top-k results. 0 is the worst, 1 is the best.",
          id: "Normalized Discounted Cumulative Gain at K"
        }
      ],
      models: [
        {
          description: "Very accurate visual document retrieval model for multilingual queries and documents.",
          id: "vidore/colqwen2-v1.0"
        },
        {
          description: "Very fast and efficient visual document retrieval model that can also take in other modalities like audio.",
          id: "Tevatron/OmniEmbed-v0.1"
        }
      ],
      spaces: [
        {
          description: "A leaderboard of visual document retrieval models.",
          id: "vidore/vidore-leaderboard"
        },
        {
          description: "Visual retrieval augmented generation demo based on ColQwen2 model.",
          id: "vidore/visual-rag-tool"
        }
      ],
      summary: "Visual document retrieval is the task of searching for relevant image-based documents, such as PDFs. These models take a text query and multiple documents as input and return the top-most relevant documents and relevancy scores as output.",
      widgetModels: [""],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/visual-question-answering/data.js
var require_data40 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/visual-question-answering/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A widely used dataset containing questions (with answers) about images.",
          id: "Graphcore/vqa"
        },
        {
          description: "A dataset to benchmark visual reasoning based on text in images.",
          id: "facebook/textvqa"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "elephant.jpeg",
            type: "img"
          },
          {
            label: "Question",
            content: "What is in this image?",
            type: "text"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "elephant",
                score: 0.97
              },
              {
                label: "elephants",
                score: 0.06
              },
              {
                label: "animal",
                score: 3e-3
              }
            ]
          }
        ]
      },
      isPlaceholder: false,
      metrics: [
        {
          description: "",
          id: "accuracy"
        },
        {
          description: "Measures how much a predicted answer differs from the ground truth based on the difference in their semantic meaning.",
          id: "wu-palmer similarity"
        }
      ],
      models: [
        {
          description: "A visual question answering model trained to convert charts and plots to text.",
          id: "google/deplot"
        },
        {
          description: "A visual question answering model trained for mathematical reasoning and chart derendering from images.",
          id: "google/matcha-base"
        },
        {
          description: "A strong visual question answering that answers questions from book covers.",
          id: "google/pix2struct-ocrvqa-large"
        }
      ],
      spaces: [
        {
          description: "An application that compares visual question answering models across different tasks.",
          id: "merve/pix2struct"
        },
        {
          description: "An application that can answer questions based on images.",
          id: "nielsr/vilt-vqa"
        },
        {
          description: "An application that can caption images and answer questions about a given image. ",
          id: "Salesforce/BLIP"
        },
        {
          description: "An application that can caption images and answer questions about a given image. ",
          id: "vumichien/Img2Prompt"
        }
      ],
      summary: "Visual Question Answering is the task of answering open-ended questions based on an image. They output natural language responses to natural language questions.",
      widgetModels: ["dandelin/vilt-b32-finetuned-vqa"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/zero-shot-classification/data.js
var require_data41 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/zero-shot-classification/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A widely used dataset used to benchmark multiple variants of text classification.",
          id: "nyu-mll/glue"
        },
        {
          description: "The Multi-Genre Natural Language Inference (MultiNLI) corpus is a crowd-sourced collection of 433k sentence pairs annotated with textual entailment information.",
          id: "nyu-mll/multi_nli"
        },
        {
          description: "FEVER is a publicly available dataset for fact extraction and verification against textual sources.",
          id: "fever/fever"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Text Input",
            content: "Dune is the best movie ever.",
            type: "text"
          },
          {
            label: "Candidate Labels",
            content: "CINEMA, ART, MUSIC",
            type: "text"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "CINEMA",
                score: 0.9
              },
              {
                label: "ART",
                score: 0.1
              },
              {
                label: "MUSIC",
                score: 0
              }
            ]
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "Powerful zero-shot text classification model.",
          id: "facebook/bart-large-mnli"
        },
        {
          description: "Cutting-edge zero-shot multilingual text classification model.",
          id: "MoritzLaurer/ModernBERT-large-zeroshot-v2.0"
        },
        {
          description: "Zero-shot text classification model that can be used for topic and sentiment classification.",
          id: "knowledgator/gliclass-modern-base-v2.0-init"
        }
      ],
      spaces: [],
      summary: "Zero-shot text classification is a task in natural language processing where a model is trained on a set of labeled examples but is then able to classify new examples from previously unseen classes.",
      widgetModels: ["facebook/bart-large-mnli"]
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/zero-shot-image-classification/data.js
var require_data42 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/zero-shot-image-classification/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          // TODO write proper description
          description: "",
          id: ""
        }
      ],
      demo: {
        inputs: [
          {
            filename: "image-classification-input.jpeg",
            type: "img"
          },
          {
            label: "Classes",
            content: "cat, dog, bird",
            type: "text"
          }
        ],
        outputs: [
          {
            type: "chart",
            data: [
              {
                label: "Cat",
                score: 0.664
              },
              {
                label: "Dog",
                score: 0.329
              },
              {
                label: "Bird",
                score: 8e-3
              }
            ]
          }
        ]
      },
      metrics: [
        {
          description: "Computes the number of times the correct label appears in top K labels predicted",
          id: "top-K accuracy"
        }
      ],
      models: [
        {
          description: "Multilingual image classification model for 80 languages.",
          id: "visheratin/mexma-siglip"
        },
        {
          description: "Strong zero-shot image classification model.",
          id: "google/siglip2-base-patch16-224"
        },
        {
          description: "Robust zero-shot image classification model.",
          id: "intfloat/mmE5-mllama-11b-instruct"
        },
        {
          description: "Powerful zero-shot image classification model supporting 94 languages.",
          id: "jinaai/jina-clip-v2"
        },
        {
          description: "Strong image classification model for biomedical domain.",
          id: "microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224"
        }
      ],
      spaces: [
        {
          description: "An application that leverages zero-shot image classification to find best captions to generate an image. ",
          id: "pharma/CLIP-Interrogator"
        },
        {
          description: "An application to compare different zero-shot image classification models. ",
          id: "merve/compare_clip_siglip"
        }
      ],
      summary: "Zero-shot image classification is the task of classifying previously unseen classes during training of a model.",
      widgetModels: ["google/siglip-so400m-patch14-224"],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/zero-shot-object-detection/data.js
var require_data43 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/zero-shot-object-detection/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [],
      demo: {
        inputs: [
          {
            filename: "zero-shot-object-detection-input.jpg",
            type: "img"
          },
          {
            label: "Classes",
            content: "cat, dog, bird",
            type: "text"
          }
        ],
        outputs: [
          {
            filename: "zero-shot-object-detection-output.jpg",
            type: "img"
          }
        ]
      },
      metrics: [
        {
          description: "The Average Precision (AP) metric is the Area Under the PR Curve (AUC-PR). It is calculated for each class separately",
          id: "Average Precision"
        },
        {
          description: "The Mean Average Precision (mAP) metric is the overall average of the AP values",
          id: "Mean Average Precision"
        },
        {
          description: "The AP\u03B1 metric is the Average Precision at the IoU threshold of a \u03B1 value, for example, AP50 and AP75",
          id: "AP\u03B1"
        }
      ],
      models: [
        {
          description: "Solid zero-shot object detection model.",
          id: "openmmlab-community/mm_grounding_dino_large_all"
        },
        {
          description: "Cutting-edge zero-shot object detection model.",
          id: "fushh7/LLMDet"
        }
      ],
      spaces: [
        {
          description: "A demo to compare different zero-shot object detection models per output and latency.",
          id: "ariG23498/zero-shot-od"
        },
        {
          description: "A demo that combines a zero-shot object detection and mask generation model for zero-shot segmentation.",
          id: "merve/OWLSAM"
        }
      ],
      summary: "Zero-shot object detection is a computer vision task to detect objects and their classes in images, without any prior training or knowledge of the classes. Zero-shot object detection models receive an image as input, as well as a list of candidate classes, and output the bounding boxes and labels where the objects have been detected.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/image-to-3d/data.js
var require_data44 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/image-to-3d/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A large dataset of over 10 million 3D objects.",
          id: "allenai/objaverse-xl"
        },
        {
          description: "A dataset of isolated object images for evaluating image-to-3D models.",
          id: "dylanebert/iso3d"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "image-to-3d-image-input.png",
            type: "img"
          }
        ],
        outputs: [
          {
            label: "Result",
            content: "image-to-3d-3d-output-filename.glb",
            type: "text"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "Fast image-to-3D mesh model by Tencent.",
          id: "TencentARC/InstantMesh"
        },
        {
          description: "3D world generation model.",
          id: "tencent/HunyuanWorld-1"
        },
        {
          description: "A scaled up image-to-3D mesh model derived from TripoSR.",
          id: "hwjiang/Real3D"
        },
        {
          description: "Consistent image-to-3d generation model.",
          id: "stabilityai/stable-point-aware-3d"
        }
      ],
      spaces: [
        {
          description: "Leaderboard to evaluate image-to-3D models.",
          id: "dylanebert/3d-arena"
        },
        {
          description: "Image-to-3D demo with mesh outputs.",
          id: "TencentARC/InstantMesh"
        },
        {
          description: "Image-to-3D demo.",
          id: "stabilityai/stable-point-aware-3d"
        },
        {
          description: "Image-to-3D demo with mesh outputs.",
          id: "hwjiang/Real3D"
        },
        {
          description: "Image-to-3D demo with splat outputs.",
          id: "dylanebert/LGM-mini"
        }
      ],
      summary: "Image-to-3D models take in image input and produce 3D output.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/text-to-3d/data.js
var require_data45 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/text-to-3d/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A large dataset of over 10 million 3D objects.",
          id: "allenai/objaverse-xl"
        },
        {
          description: "Descriptive captions for 3D objects in Objaverse.",
          id: "tiange/Cap3D"
        }
      ],
      demo: {
        inputs: [
          {
            label: "Prompt",
            content: "a cat statue",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Result",
            content: "text-to-3d-3d-output-filename.glb",
            type: "text"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "Text-to-3D mesh model by OpenAI",
          id: "openai/shap-e"
        },
        {
          description: "Generative 3D gaussian splatting model.",
          id: "ashawkey/LGM"
        }
      ],
      spaces: [
        {
          description: "Text-to-3D demo with mesh outputs.",
          id: "hysts/Shap-E"
        },
        {
          description: "Text/image-to-3D demo with splat outputs.",
          id: "ashawkey/LGM"
        }
      ],
      summary: "Text-to-3D models take in text input and produce 3D output.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/keypoint-detection/data.js
var require_data46 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/keypoint-detection/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "A dataset of hand keypoints of over 500k examples.",
          id: "Vincent-luo/hagrid-mediapipe-hands"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "keypoint-detection-input.png",
            type: "img"
          }
        ],
        outputs: [
          {
            filename: "keypoint-detection-output.png",
            type: "img"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "A robust keypoint detection model.",
          id: "magic-leap-community/superpoint"
        },
        {
          description: "A robust keypoint matching model.",
          id: "magic-leap-community/superglue_outdoor"
        },
        {
          description: "Strong keypoint detection model used to detect human pose.",
          id: "qualcomm/RTMPose-Body2d"
        },
        {
          description: "Powerful keypoint matching model.",
          id: "ETH-CVG/lightglue_disk"
        }
      ],
      spaces: [
        {
          description: "An application that detects hand keypoints in real-time.",
          id: "datasciencedojo/Hand-Keypoint-Detection-Realtime"
        },
        {
          description: "An application for keypoint detection and matching.",
          id: "ETH-CVG/LightGlue"
        }
      ],
      summary: "Keypoint detection is the task of identifying meaningful distinctive points or features in an image.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/video-text-to-text/data.js
var require_data47 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/video-text-to-text/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Multiple-choice questions and answers about videos.",
          id: "lmms-lab/Video-MME"
        },
        {
          description: "A dataset of instructions and question-answer pairs about videos.",
          id: "lmms-lab/VideoChatGPT"
        },
        {
          description: "Large video understanding dataset.",
          id: "HuggingFaceFV/finevideo"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "video-text-to-text-input.gif",
            type: "img"
          },
          {
            label: "Text Prompt",
            content: "What is happening in this video?",
            type: "text"
          }
        ],
        outputs: [
          {
            label: "Answer",
            content: "The video shows a series of images showing a fountain with water jets and a variety of colorful flowers and butterflies in the background.",
            type: "text"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "A robust video-text-to-text model.",
          id: "Vision-CAIR/LongVU_Qwen2_7B"
        },
        {
          description: "Strong video-text-to-text model with reasoning capabilities.",
          id: "GoodiesHere/Apollo-LMMs-Apollo-7B-t32"
        },
        {
          description: "Strong video-text-to-text model.",
          id: "HuggingFaceTB/SmolVLM2-2.2B-Instruct"
        }
      ],
      spaces: [
        {
          description: "An application to chat with a video-text-to-text model.",
          id: "llava-hf/video-llava"
        },
        {
          description: "A leaderboard for various video-text-to-text models.",
          id: "opencompass/openvlm_video_leaderboard"
        },
        {
          description: "An application to generate highlights from a video.",
          id: "HuggingFaceTB/SmolVLM2-HighlightGenerator"
        }
      ],
      summary: "Video-text-to-text models take in a video and a text prompt and output text. These models are also called video-language models.",
      widgetModels: [""],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/video-to-video/data.js
var require_data48 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/video-to-video/data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var taskData = {
      datasets: [
        {
          description: "Dataset with detailed annotations for training and benchmarking video instance editing.",
          id: "suimu/VIRESET"
        },
        {
          description: "Dataset to evaluate models on long video generation and understanding.",
          id: "zhangsh2001/LongV-EVAL"
        },
        {
          description: "Collection of 104 demo videos from the SeedVR/SeedVR2 series showcasing model outputs.",
          id: "Iceclear/SeedVR_VideoDemos"
        }
      ],
      demo: {
        inputs: [
          {
            filename: "input.gif",
            type: "img"
          }
        ],
        outputs: [
          {
            filename: "output.gif",
            type: "img"
          }
        ]
      },
      metrics: [],
      models: [
        {
          description: "Model for editing outfits, character, and scenery in videos.",
          id: "decart-ai/Lucy-Edit-Dev"
        },
        {
          description: "Framework that uses 3D mesh proxies for precise, consistent video editing.",
          id: "LeoLau/Shape-for-Motion"
        },
        {
          description: "Model for generating physics-aware videos from input videos and control conditions.",
          id: "nvidia/Cosmos-Transfer2.5-2B"
        },
        {
          description: "A model to upscale videos at input, designed for seamless use with ComfyUI.",
          id: "numz/SeedVR2_comfyUI"
        }
      ],
      spaces: [
        {
          description: "Interactive demo space for Lucy-Edit-Dev video editing.",
          id: "decart-ai/lucy-edit-dev"
        },
        {
          description: "Demo space for SeedVR2-3B showcasing video upscaling and restoration.",
          id: "ByteDance-Seed/SeedVR2-3B"
        }
      ],
      summary: "Video-to-video models take one or more videos as input and generate new videos as output. They can enhance quality, interpolate frames, modify styles, or create new motion dynamics, enabling creative applications, video production, and research.",
      widgetModels: [],
      youtubeId: ""
    };
    exports2.default = taskData;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tasks/index.js
var require_tasks2 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tasks/index.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TASKS_DATA = exports2.TASKS_MODEL_LIBRARIES = void 0;
    var pipelines_js_1 = require_pipelines();
    var data_js_1 = __importDefault(require_data());
    var data_js_2 = __importDefault(require_data2());
    var data_js_3 = __importDefault(require_data3());
    var data_js_4 = __importDefault(require_data4());
    var data_js_5 = __importDefault(require_data5());
    var data_js_6 = __importDefault(require_data6());
    var data_js_7 = __importDefault(require_data7());
    var data_js_8 = __importDefault(require_data8());
    var data_js_9 = __importDefault(require_data9());
    var data_js_10 = __importDefault(require_data10());
    var data_js_11 = __importDefault(require_data11());
    var data_js_12 = __importDefault(require_data12());
    var data_js_13 = __importDefault(require_data13());
    var data_js_14 = __importDefault(require_data14());
    var data_js_15 = __importDefault(require_data15());
    var data_js_16 = __importDefault(require_data16());
    var data_js_17 = __importDefault(require_data17());
    var data_js_18 = __importDefault(require_data18());
    var data_js_19 = __importDefault(require_data19());
    var data_js_20 = __importDefault(require_data20());
    var data_js_21 = __importDefault(require_data21());
    var data_js_22 = __importDefault(require_data22());
    var data_js_23 = __importDefault(require_data23());
    var data_js_24 = __importDefault(require_data24());
    var data_js_25 = __importDefault(require_data25());
    var data_js_26 = __importDefault(require_data26());
    var data_js_27 = __importDefault(require_data27());
    var data_js_28 = __importDefault(require_data28());
    var data_js_29 = __importDefault(require_data29());
    var data_js_30 = __importDefault(require_data30());
    var data_js_31 = __importDefault(require_data31());
    var data_js_32 = __importDefault(require_data32());
    var data_js_33 = __importDefault(require_data33());
    var data_js_34 = __importDefault(require_data34());
    var data_js_35 = __importDefault(require_data35());
    var data_js_36 = __importDefault(require_data36());
    var data_js_37 = __importDefault(require_data37());
    var data_js_38 = __importDefault(require_data38());
    var data_js_39 = __importDefault(require_data39());
    var data_js_40 = __importDefault(require_data40());
    var data_js_41 = __importDefault(require_data41());
    var data_js_42 = __importDefault(require_data42());
    var data_js_43 = __importDefault(require_data43());
    var data_js_44 = __importDefault(require_data44());
    var data_js_45 = __importDefault(require_data45());
    var data_js_46 = __importDefault(require_data46());
    var data_js_47 = __importDefault(require_data47());
    var data_js_48 = __importDefault(require_data48());
    exports2.TASKS_MODEL_LIBRARIES = {
      "audio-classification": ["speechbrain", "transformers", "transformers.js"],
      "audio-to-audio": ["asteroid", "fairseq", "speechbrain"],
      "automatic-speech-recognition": ["espnet", "nemo", "speechbrain", "transformers", "transformers.js"],
      "audio-text-to-text": ["transformers"],
      "depth-estimation": ["transformers", "transformers.js"],
      "document-question-answering": ["transformers", "transformers.js"],
      "feature-extraction": ["sentence-transformers", "transformers", "transformers.js"],
      "fill-mask": ["transformers", "transformers.js"],
      "graph-ml": ["transformers"],
      "image-classification": ["keras", "timm", "transformers", "transformers.js"],
      "image-feature-extraction": ["timm", "transformers"],
      "image-segmentation": ["transformers", "transformers.js"],
      "image-text-to-text": ["transformers"],
      "image-text-to-image": ["diffusers"],
      "image-text-to-video": ["diffusers"],
      "image-to-image": ["diffusers", "transformers", "transformers.js"],
      "image-to-text": ["transformers", "transformers.js"],
      "image-to-video": ["diffusers"],
      "keypoint-detection": ["transformers"],
      "video-classification": ["transformers"],
      "mask-generation": ["transformers"],
      "multiple-choice": ["transformers"],
      "object-detection": ["transformers", "transformers.js", "ultralytics"],
      other: [],
      "question-answering": ["adapter-transformers", "allennlp", "transformers", "transformers.js"],
      robotics: [],
      "reinforcement-learning": ["transformers", "stable-baselines3", "ml-agents", "sample-factory"],
      "sentence-similarity": ["sentence-transformers", "spacy", "transformers.js"],
      summarization: ["transformers", "transformers.js"],
      "table-question-answering": ["transformers"],
      "table-to-text": ["transformers"],
      "tabular-classification": ["sklearn"],
      "tabular-regression": ["sklearn"],
      "tabular-to-text": ["transformers"],
      "text-classification": ["adapter-transformers", "setfit", "spacy", "transformers", "transformers.js"],
      "text-generation": ["transformers", "transformers.js"],
      "text-ranking": ["sentence-transformers", "transformers"],
      "text-retrieval": [],
      "text-to-image": ["diffusers"],
      "text-to-speech": ["espnet", "tensorflowtts", "transformers", "transformers.js"],
      "text-to-audio": ["transformers", "transformers.js"],
      "text-to-video": ["diffusers"],
      "time-series-forecasting": [],
      "token-classification": [
        "adapter-transformers",
        "flair",
        "spacy",
        "span-marker",
        "stanza",
        "transformers",
        "transformers.js"
      ],
      translation: ["transformers", "transformers.js"],
      "unconditional-image-generation": ["diffusers"],
      "video-text-to-text": ["transformers"],
      "visual-question-answering": ["transformers", "transformers.js"],
      "voice-activity-detection": [],
      "zero-shot-classification": ["transformers", "transformers.js"],
      "zero-shot-image-classification": ["transformers", "transformers.js"],
      "zero-shot-object-detection": ["transformers", "transformers.js"],
      "text-to-3d": ["diffusers"],
      "image-to-3d": ["diffusers"],
      "any-to-any": ["transformers"],
      "visual-document-retrieval": ["transformers"],
      "video-to-video": ["diffusers"]
    };
    function getData(type, partialTaskData = data_js_21.default) {
      return {
        ...partialTaskData,
        id: type,
        label: pipelines_js_1.PIPELINE_DATA[type].name,
        libraries: exports2.TASKS_MODEL_LIBRARIES[type]
      };
    }
    exports2.TASKS_DATA = {
      "any-to-any": getData("any-to-any", data_js_1.default),
      "audio-classification": getData("audio-classification", data_js_2.default),
      "audio-to-audio": getData("audio-to-audio", data_js_4.default),
      "audio-text-to-text": getData("audio-text-to-text", data_js_3.default),
      "automatic-speech-recognition": getData("automatic-speech-recognition", data_js_5.default),
      "depth-estimation": getData("depth-estimation", data_js_20.default),
      "document-question-answering": getData("document-question-answering", data_js_6.default),
      "visual-document-retrieval": getData("visual-document-retrieval", data_js_39.default),
      "feature-extraction": getData("feature-extraction", data_js_7.default),
      "fill-mask": getData("fill-mask", data_js_8.default),
      "graph-ml": void 0,
      "image-classification": getData("image-classification", data_js_9.default),
      "image-feature-extraction": getData("image-feature-extraction", data_js_10.default),
      "image-segmentation": getData("image-segmentation", data_js_16.default),
      "image-to-image": getData("image-to-image", data_js_11.default),
      "image-text-to-text": getData("image-text-to-text", data_js_13.default),
      "image-text-to-image": getData("image-text-to-image", data_js_14.default),
      "image-text-to-video": getData("image-text-to-video", data_js_15.default),
      "image-to-text": getData("image-to-text", data_js_12.default),
      "image-to-video": getData("image-to-video", data_js_17.default),
      "keypoint-detection": getData("keypoint-detection", data_js_46.default),
      "mask-generation": getData("mask-generation", data_js_18.default),
      "multiple-choice": void 0,
      "object-detection": getData("object-detection", data_js_19.default),
      "video-classification": getData("video-classification", data_js_38.default),
      other: void 0,
      "question-answering": getData("question-answering", data_js_23.default),
      "reinforcement-learning": getData("reinforcement-learning", data_js_22.default),
      robotics: void 0,
      "sentence-similarity": getData("sentence-similarity", data_js_24.default),
      summarization: getData("summarization", data_js_25.default),
      "table-question-answering": getData("table-question-answering", data_js_26.default),
      "table-to-text": void 0,
      "tabular-classification": getData("tabular-classification", data_js_27.default),
      "tabular-regression": getData("tabular-regression", data_js_28.default),
      "tabular-to-text": void 0,
      "text-classification": getData("text-classification", data_js_33.default),
      "text-generation": getData("text-generation", data_js_34.default),
      "text-ranking": getData("text-ranking", data_js_35.default),
      "text-retrieval": void 0,
      "text-to-image": getData("text-to-image", data_js_29.default),
      "text-to-speech": getData("text-to-speech", data_js_30.default),
      "text-to-audio": void 0,
      "text-to-video": getData("text-to-video", data_js_36.default),
      "time-series-forecasting": void 0,
      "token-classification": getData("token-classification", data_js_31.default),
      translation: getData("translation", data_js_32.default),
      "unconditional-image-generation": getData("unconditional-image-generation", data_js_37.default),
      "video-text-to-text": getData("video-text-to-text", data_js_47.default),
      "video-to-video": getData("video-to-video", data_js_48.default),
      "visual-question-answering": getData("visual-question-answering", data_js_40.default),
      "voice-activity-detection": void 0,
      "zero-shot-classification": getData("zero-shot-classification", data_js_41.default),
      "zero-shot-image-classification": getData("zero-shot-image-classification", data_js_42.default),
      "zero-shot-object-detection": getData("zero-shot-object-detection", data_js_43.default),
      "text-to-3d": getData("text-to-3d", data_js_45.default),
      "image-to-3d": getData("image-to-3d", data_js_44.default)
    };
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/snippets/inputs.js
var require_inputs = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/snippets/inputs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getModelInputSnippet = getModelInputSnippet;
    var inputsZeroShotClassification = () => `"Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!"`;
    var inputsTranslation = () => `"\u041C\u0435\u043D\u044F \u0437\u043E\u0432\u0443\u0442 \u0412\u043E\u043B\u044C\u0444\u0433\u0430\u043D\u0433 \u0438 \u044F \u0436\u0438\u0432\u0443 \u0432 \u0411\u0435\u0440\u043B\u0438\u043D\u0435"`;
    var inputsSummarization = () => `"The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct."`;
    var inputsTableQuestionAnswering = () => `{
    "query": "How many stars does the transformers repository have?",
    "table": {
        "Repository": ["Transformers", "Datasets", "Tokenizers"],
        "Stars": ["36542", "4512", "3934"],
        "Contributors": ["651", "77", "34"],
        "Programming language": [
            "Python",
            "Python",
            "Rust, Python and NodeJS"
        ]
    }
}`;
    var inputsVisualQuestionAnswering = () => `{
        "image": "cat.png",
        "question": "What is in this image?"
    }`;
    var inputsQuestionAnswering = () => `{
    "question": "What is my name?",
    "context": "My name is Clara and I live in Berkeley."
}`;
    var inputsTextClassification = () => `"I like you. I love you"`;
    var inputsTokenClassification = () => `"My name is Sarah Jessica Parker but you can call me Jessica"`;
    var inputsTextGeneration = (model) => {
      if (model.tags.includes("conversational")) {
        return model.pipeline_tag === "text-generation" ? [{ role: "user", content: "What is the capital of France?" }] : [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this image in one sentence."
              },
              {
                type: "image_url",
                image_url: {
                  url: "https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg"
                }
              }
            ]
          }
        ];
      }
      return `"Can you please let us know more details about your "`;
    };
    var inputsFillMask = (model) => `"The answer to the universe is ${model.mask_token}."`;
    var inputsSentenceSimilarity = () => `{
    "source_sentence": "That is a happy person",
    "sentences": [
        "That is a happy dog",
        "That is a very happy person",
        "Today is a sunny day"
    ]
}`;
    var inputsFeatureExtraction = () => `"Today is a sunny day and I will get some ice cream."`;
    var inputsImageClassification = () => `"cats.jpg"`;
    var inputsImageToText = () => `"cats.jpg"`;
    var inputsImageToImage = () => `{
    "image": "cat.png",
    "prompt": "Turn the cat into a tiger."
}`;
    var inputsImageToVideo = () => `{
    "image": "cat.png",
    "prompt": "The cat starts to dance"
}`;
    var inputsImageTextToImage = () => `{
    "image": "cat.png",
    "prompt": "Turn the cat into a tiger."
}`;
    var inputsImageTextToVideo = () => `{
    "image": "cat.png",
    "prompt": "The cat starts to dance"
}`;
    var inputsImageSegmentation = () => `"cats.jpg"`;
    var inputsObjectDetection = () => `"cats.jpg"`;
    var inputsAudioToAudio = () => `"sample1.flac"`;
    var inputsAudioClassification = () => `"sample1.flac"`;
    var inputsTextToImage = () => `"Astronaut riding a horse"`;
    var inputsTextToVideo = () => `"A young man walking on the street"`;
    var inputsTextToSpeech = () => `"The answer to the universe is 42"`;
    var inputsTextToAudio = () => `"liquid drum and bass, atmospheric synths, airy sounds"`;
    var inputsAutomaticSpeechRecognition = () => `"sample1.flac"`;
    var inputsTabularPrediction = () => `'{"Height":[11.52,12.48],"Length1":[23.2,24.0],"Length2":[25.4,26.3],"Species": ["Bream","Bream"]}'`;
    var inputsZeroShotImageClassification = () => `"cats.jpg"`;
    var modelInputSnippets = {
      "audio-to-audio": inputsAudioToAudio,
      "audio-classification": inputsAudioClassification,
      "automatic-speech-recognition": inputsAutomaticSpeechRecognition,
      "document-question-answering": inputsVisualQuestionAnswering,
      "feature-extraction": inputsFeatureExtraction,
      "fill-mask": inputsFillMask,
      "image-classification": inputsImageClassification,
      "image-to-text": inputsImageToText,
      "image-to-image": inputsImageToImage,
      "image-to-video": inputsImageToVideo,
      "image-text-to-image": inputsImageTextToImage,
      "image-text-to-video": inputsImageTextToVideo,
      "image-segmentation": inputsImageSegmentation,
      "object-detection": inputsObjectDetection,
      "question-answering": inputsQuestionAnswering,
      "sentence-similarity": inputsSentenceSimilarity,
      summarization: inputsSummarization,
      "table-question-answering": inputsTableQuestionAnswering,
      "tabular-regression": inputsTabularPrediction,
      "tabular-classification": inputsTabularPrediction,
      "text-classification": inputsTextClassification,
      "text-generation": inputsTextGeneration,
      "image-text-to-text": inputsTextGeneration,
      "text-to-image": inputsTextToImage,
      "text-to-video": inputsTextToVideo,
      "text-to-speech": inputsTextToSpeech,
      "text-to-audio": inputsTextToAudio,
      "token-classification": inputsTokenClassification,
      translation: inputsTranslation,
      "zero-shot-classification": inputsZeroShotClassification,
      "zero-shot-image-classification": inputsZeroShotImageClassification
    };
    function getModelInputSnippet(model, noWrap = false, noQuotes = false) {
      if (model.pipeline_tag) {
        const inputs = modelInputSnippets[model.pipeline_tag];
        if (inputs) {
          let result = inputs(model);
          if (typeof result === "string") {
            if (noWrap) {
              result = result.replace(/(?:(?:\r?\n|\r)\t*)|\t+/g, " ");
            }
            if (noQuotes) {
              const REGEX_QUOTES = /^"(.+)"$/s;
              const match = result.match(REGEX_QUOTES);
              result = match ? match[1] : result;
            }
          }
          return result;
        }
      }
      return "No input example has been defined for this model task.";
    }
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/snippets/common.js
var require_common = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/snippets/common.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringifyMessages = stringifyMessages;
    exports2.stringifyGenerationConfig = stringifyGenerationConfig;
    function stringifyMessages(messages, opts) {
      let messagesStr = JSON.stringify(messages, null, "	");
      if (opts?.indent) {
        messagesStr = messagesStr.replaceAll("\n", `
${opts.indent}`);
      }
      if (!opts?.attributeKeyQuotes) {
        messagesStr = messagesStr.replace(/"([^"]+)":/g, "$1:");
      }
      if (opts?.customContentEscaper) {
        messagesStr = opts.customContentEscaper(messagesStr);
      }
      return messagesStr;
    }
    function stringifyGenerationConfig(config, opts) {
      const quote = opts.attributeKeyQuotes ? `"` : "";
      return Object.entries(config).map(([key, val]) => `${quote}${key}${quote}${opts.attributeValueConnector}${val},`).join(`${opts.indent}`);
    }
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/model-libraries-snippets.js
var require_model_libraries_snippets = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/model-libraries-snippets.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.phantom_wan = exports2.perception_encoder = exports2.paddleocr = exports2.paddlenlp = exports2.open_clip = exports2.mesh_anything = exports2.matanyone = exports2.mars5_tts = exports2.mamba_ssm = exports2.tf_keras = exports2.lerobot = exports2.llama_cpp_python = exports2.lightning_ir = exports2.kittentts = exports2.kimi_audio = exports2.kernels = exports2.keras_hub = exports2.keras = exports2.htrflow = exports2.indextts = exports2.gliner2 = exports2.gliner = exports2.flair = exports2.fairseq = exports2.espnet = exports2.espnetASR = exports2.espnetTTS = exports2.edsnlp = exports2.cartesia_mlx = exports2.cartesia_pytorch = exports2.diffusionkit = exports2.diffusers = exports2.describe_anything = exports2.dia2 = exports2.dia = exports2.derm_foundation = exports2.depth_pro = exports2.depth_anything_v2 = exports2.cxr_foundation = exports2.sap_rpt_one_oss = exports2.chronos_forecasting = exports2.chatterbox = exports2.bm25s = exports2.bertopic = exports2.ben2 = exports2.audioseal = exports2.asteroid = exports2.araclip = exports2.allennlp = exports2.adapters = void 0;
    exports2.pxia = exports2.outetts = exports2.nemo = exports2.pruna = exports2.model2vec = exports2.mlx = exports2.mlxim = exports2.univa = exports2.swarmformer = exports2.supertonic = exports2.birefnet = exports2.ultralytics = exports2.chattts = exports2.vui = exports2.voxcpm = exports2.voicecraft = exports2.lvface = exports2.vfimamba = exports2.videoprism = exports2.vibevoice = exports2.sana = exports2.sentis = exports2.mlAgents = exports2.stableBaselines3 = exports2.fasttext = exports2.peft = exports2.transformersJS = exports2.transformers = exports2.terratorch = exports2.speechbrain = exports2.stanza = exports2.span_marker = exports2.spacy = exports2.setfit = exports2.sentenceTransformers = exports2.sampleFactory = exports2.sam_3d_body = exports2.sam_3d_objects = exports2.sam2 = exports2.fastai = exports2.stable_audio_tools = exports2.sklearn = exports2.seed_story = exports2.saelens = exports2.timm = exports2.tensorflowtts = exports2.renderformer = exports2.relik = exports2.pyannote_audio = exports2.pyannote_audio_pipeline = void 0;
    exports2.zonos = exports2.hezar = exports2.threedtopia_xl = exports2.whisperkit = exports2.audiocraft = exports2.anemoi = exports2.pythae = void 0;
    var library_to_tasks_js_1 = require_library_to_tasks();
    var inputs_js_1 = require_inputs();
    var common_js_1 = require_common();
    var TAG_CUSTOM_CODE = "custom_code";
    function nameWithoutNamespace(modelId) {
      const splitted = modelId.split("/");
      return splitted.length === 1 ? splitted[0] : splitted[1];
    }
    var escapeStringForJson = (str) => JSON.stringify(str).slice(1, -1);
    var adapters = (model) => [
      `from adapters import AutoAdapterModel

model = AutoAdapterModel.from_pretrained("${model.config?.adapter_transformers?.model_name}")
model.load_adapter("${model.id}", set_active=True)`
    ];
    exports2.adapters = adapters;
    var allennlpUnknown = (model) => [
      `import allennlp_models
from allennlp.predictors.predictor import Predictor

predictor = Predictor.from_path("hf://${model.id}")`
    ];
    var allennlpQuestionAnswering = (model) => [
      `import allennlp_models
from allennlp.predictors.predictor import Predictor

predictor = Predictor.from_path("hf://${model.id}")
predictor_input = {"passage": "My name is Wolfgang and I live in Berlin", "question": "Where do I live?"}
predictions = predictor.predict_json(predictor_input)`
    ];
    var allennlp = (model) => {
      if (model.tags.includes("question-answering")) {
        return allennlpQuestionAnswering(model);
      }
      return allennlpUnknown(model);
    };
    exports2.allennlp = allennlp;
    var araclip = (model) => [
      `from araclip import AraClip

model = AraClip.from_pretrained("${model.id}")`
    ];
    exports2.araclip = araclip;
    var asteroid = (model) => [
      `from asteroid.models import BaseModel

model = BaseModel.from_pretrained("${model.id}")`
    ];
    exports2.asteroid = asteroid;
    var audioseal = (model) => {
      const watermarkSnippet = `# Watermark Generator
from audioseal import AudioSeal

model = AudioSeal.load_generator("${model.id}")
# pass a tensor (tensor_wav) of shape (batch, channels, samples) and a sample rate
wav, sr = tensor_wav, 16000
	
watermark = model.get_watermark(wav, sr)
watermarked_audio = wav + watermark`;
      const detectorSnippet = `# Watermark Detector
from audioseal import AudioSeal

detector = AudioSeal.load_detector("${model.id}")
	
result, message = detector.detect_watermark(watermarked_audio, sr)`;
      return [watermarkSnippet, detectorSnippet];
    };
    exports2.audioseal = audioseal;
    function get_base_diffusers_model(model) {
      return model.cardData?.base_model?.toString() ?? "fill-in-base-model";
    }
    function get_prompt_from_diffusers_model(model) {
      const prompt = model.widgetData?.[0]?.text ?? model.cardData?.instance_prompt;
      if (prompt) {
        return escapeStringForJson(prompt);
      }
    }
    var ben2 = (model) => [
      `import requests
from PIL import Image
from ben2 import AutoModel

url = "https://huggingface.co/datasets/mishig/sample_images/resolve/main/teapot.jpg"
image = Image.open(requests.get(url, stream=True).raw)

model = AutoModel.from_pretrained("${model.id}")
model.to("cuda").eval()
foreground = model.inference(image)
`
    ];
    exports2.ben2 = ben2;
    var bertopic = (model) => [
      `from bertopic import BERTopic

model = BERTopic.load("${model.id}")`
    ];
    exports2.bertopic = bertopic;
    var bm25s = (model) => [
      `from bm25s.hf import BM25HF

retriever = BM25HF.load_from_hub("${model.id}")`
    ];
    exports2.bm25s = bm25s;
    var chatterbox = () => [
      `# pip install chatterbox-tts
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

model = ChatterboxTTS.from_pretrained(device="cuda")

text = "Ezreal and Jinx teamed up with Ahri, Yasuo, and Teemo to take down the enemy's Nexus in an epic late-game pentakill."
wav = model.generate(text)
ta.save("test-1.wav", wav, model.sr)

# If you want to synthesize with a different voice, specify the audio prompt
AUDIO_PROMPT_PATH="YOUR_FILE.wav"
wav = model.generate(text, audio_prompt_path=AUDIO_PROMPT_PATH)
ta.save("test-2.wav", wav, model.sr)`
    ];
    exports2.chatterbox = chatterbox;
    var chronos_forecasting = (model) => {
      const installSnippet = `pip install chronos-forecasting`;
      const exampleSnippet = `import pandas as pd
from chronos import BaseChronosPipeline

pipeline = BaseChronosPipeline.from_pretrained("${model.id}", device_map="cuda")

# Load historical data
context_df = pd.read_csv("https://autogluon.s3.us-west-2.amazonaws.com/datasets/timeseries/misc/AirPassengers.csv")

# Generate predictions
pred_df = pipeline.predict_df(
    context_df,
    prediction_length=36,  # Number of steps to forecast
    quantile_levels=[0.1, 0.5, 0.9],  # Quantiles for probabilistic forecast
    id_column="item_id",  # Column identifying different time series
    timestamp_column="Month",  # Column with datetime information
    target="#Passengers",  # Column(s) with time series values to predict
)`;
      return [installSnippet, exampleSnippet];
    };
    exports2.chronos_forecasting = chronos_forecasting;
    var sap_rpt_one_oss = () => {
      const installSnippet = `pip install git+https://github.com/SAP-samples/sap-rpt-1-oss`;
      const classificationSnippet = `# Run a classification task
from sklearn.datasets import load_breast_cancer
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

from sap_rpt_oss import SAP_RPT_OSS_Classifier

# Load sample data
X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)

# Initialize a classifier, 8k context and 8-fold bagging gives best performance, reduce if running out of memory
clf = SAP_RPT_OSS_Classifier(max_context_size=8192, bagging=8)

clf.fit(X_train, y_train)

# Predict probabilities
prediction_probabilities = clf.predict_proba(X_test)
# Predict labels
predictions = clf.predict(X_test)
print("Accuracy", accuracy_score(y_test, predictions))`;
      const regressionsSnippet = `# Run a regression task
from sklearn.datasets import fetch_openml
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split

from sap_rpt_oss import SAP_RPT_OSS_Regressor

# Load sample data
df = fetch_openml(data_id=531, as_frame=True)
X = df.data
y = df.target.astype(float)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)

# Initialize the regressor, 8k context and 8-fold bagging gives best performance, reduce if running out of memory
regressor = SAP_RPT_OSS_Regressor(max_context_size=8192, bagging=8)

regressor.fit(X_train, y_train)

# Predict on the test set
predictions = regressor.predict(X_test)

r2 = r2_score(y_test, predictions)
print("R\xB2 Score:", r2)`;
      return [installSnippet, classificationSnippet, regressionsSnippet];
    };
    exports2.sap_rpt_one_oss = sap_rpt_one_oss;
    var cxr_foundation = () => [
      `# pip install git+https://github.com/Google-Health/cxr-foundation.git#subdirectory=python

# Load image as grayscale (Stillwaterising, CC0, via Wikimedia Commons)
import requests
from PIL import Image
from io import BytesIO
image_url = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Chest_Xray_PA_3-8-2010.png"
img = Image.open(requests.get(image_url, headers={'User-Agent': 'Demo'}, stream=True).raw).convert('L')

# Run inference
from clientside.clients import make_hugging_face_client
cxr_client = make_hugging_face_client('cxr_model')
print(cxr_client.get_image_embeddings_from_images([img]))`
    ];
    exports2.cxr_foundation = cxr_foundation;
    var depth_anything_v2 = (model) => {
      let encoder;
      let features;
      let out_channels;
      encoder = "<ENCODER>";
      features = "<NUMBER_OF_FEATURES>";
      out_channels = "<OUT_CHANNELS>";
      if (model.id === "depth-anything/Depth-Anything-V2-Small") {
        encoder = "vits";
        features = "64";
        out_channels = "[48, 96, 192, 384]";
      } else if (model.id === "depth-anything/Depth-Anything-V2-Base") {
        encoder = "vitb";
        features = "128";
        out_channels = "[96, 192, 384, 768]";
      } else if (model.id === "depth-anything/Depth-Anything-V2-Large") {
        encoder = "vitl";
        features = "256";
        out_channels = "[256, 512, 1024, 1024";
      }
      return [
        `
# Install from https://github.com/DepthAnything/Depth-Anything-V2

# Load the model and infer depth from an image
import cv2
import torch

from depth_anything_v2.dpt import DepthAnythingV2

# instantiate the model
model = DepthAnythingV2(encoder="${encoder}", features=${features}, out_channels=${out_channels})

# load the weights
filepath = hf_hub_download(repo_id="${model.id}", filename="depth_anything_v2_${encoder}.pth", repo_type="model")
state_dict = torch.load(filepath, map_location="cpu")
model.load_state_dict(state_dict).eval()

raw_img = cv2.imread("your/image/path")
depth = model.infer_image(raw_img) # HxW raw depth map in numpy
    `
      ];
    };
    exports2.depth_anything_v2 = depth_anything_v2;
    var depth_pro = (model) => {
      const installSnippet = `# Download checkpoint
pip install huggingface-hub
huggingface-cli download --local-dir checkpoints ${model.id}`;
      const inferenceSnippet = `import depth_pro

# Load model and preprocessing transform
model, transform = depth_pro.create_model_and_transforms()
model.eval()

# Load and preprocess an image.
image, _, f_px = depth_pro.load_rgb("example.png")
image = transform(image)

# Run inference.
prediction = model.infer(image, f_px=f_px)

# Results: 1. Depth in meters
depth = prediction["depth"]
# Results: 2. Focal length in pixels
focallength_px = prediction["focallength_px"]`;
      return [installSnippet, inferenceSnippet];
    };
    exports2.depth_pro = depth_pro;
    var derm_foundation = () => [
      `from huggingface_hub import from_pretrained_keras
import tensorflow as tf, requests

# Load and format input
IMAGE_URL = "https://storage.googleapis.com/dx-scin-public-data/dataset/images/3445096909671059178.png"
input_tensor = tf.train.Example(
    features=tf.train.Features(
        feature={
            "image/encoded": tf.train.Feature(
                bytes_list=tf.train.BytesList(value=[requests.get(IMAGE_URL, stream=True).content])
            )
        }
    )
).SerializeToString()

# Load model and run inference
loaded_model = from_pretrained_keras("google/derm-foundation")
infer = loaded_model.signatures["serving_default"]
print(infer(inputs=tf.constant([input_tensor])))`
    ];
    exports2.derm_foundation = derm_foundation;
    var dia = (model) => [
      `import soundfile as sf
from dia.model import Dia

model = Dia.from_pretrained("${model.id}")
text = "[S1] Dia is an open weights text to dialogue model. [S2] You get full control over scripts and voices. [S1] Wow. Amazing. (laughs) [S2] Try it now on Git hub or Hugging Face."
output = model.generate(text)

sf.write("simple.mp3", output, 44100)`
    ];
    exports2.dia = dia;
    var dia2 = (model) => [
      `from dia2 import Dia2, GenerationConfig, SamplingConfig

dia = Dia2.from_repo("${model.id}", device="cuda", dtype="bfloat16")
config = GenerationConfig(
    cfg_scale=2.0,
    audio=SamplingConfig(temperature=0.8, top_k=50),
    use_cuda_graph=True,
)
result = dia.generate("[S1] Hello Dia2!", config=config, output_wav="hello.wav", verbose=True)
`
    ];
    exports2.dia2 = dia2;
    var describe_anything = (model) => [
      `# pip install git+https://github.com/NVlabs/describe-anything
from huggingface_hub import snapshot_download
from dam import DescribeAnythingModel

snapshot_download(${model.id}, local_dir="checkpoints")

dam = DescribeAnythingModel(
	model_path="checkpoints",
	conv_mode="v1",
	prompt_mode="focal_prompt",
)`
    ];
    exports2.describe_anything = describe_anything;
    var diffusers_install = "pip install -U diffusers transformers accelerate";
    var diffusersDefaultPrompt = "Astronaut in a jungle, cold color palette, muted colors, detailed, 8k";
    var diffusersImg2ImgDefaultPrompt = "Turn this cat into a dog";
    var diffusersVideoDefaultPrompt = "A man with short gray hair plays a red electric guitar.";
    var diffusers_default = (model) => [
      `import torch
from diffusers import DiffusionPipeline

# switch to "mps" for apple devices
pipe = DiffusionPipeline.from_pretrained("${model.id}", dtype=torch.bfloat16, device_map="cuda")

prompt = "${get_prompt_from_diffusers_model(model) ?? diffusersDefaultPrompt}"
image = pipe(prompt).images[0]`
    ];
    var diffusers_image_to_image = (model) => [
      `import torch
from diffusers import DiffusionPipeline
from diffusers.utils import load_image

# switch to "mps" for apple devices
pipe = DiffusionPipeline.from_pretrained("${model.id}", dtype=torch.bfloat16, device_map="cuda")

prompt = "${get_prompt_from_diffusers_model(model) ?? diffusersImg2ImgDefaultPrompt}"
input_image = load_image("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/cat.png")

image = pipe(image=input_image, prompt=prompt).images[0]`
    ];
    var diffusers_image_to_video = (model) => [
      `import torch
from diffusers import DiffusionPipeline
from diffusers.utils import load_image, export_to_video

# switch to "mps" for apple devices
pipe = DiffusionPipeline.from_pretrained("${model.id}", dtype=torch.bfloat16, device_map="cuda")
pipe.to("cuda")

prompt = "${get_prompt_from_diffusers_model(model) ?? diffusersVideoDefaultPrompt}"
image = load_image(
    "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/guitar-man.png"
)

output = pipe(image=image, prompt=prompt).frames[0]
export_to_video(output, "output.mp4")`
    ];
    var diffusers_controlnet = (model) => [
      `from diffusers import ControlNetModel, StableDiffusionControlNetPipeline

controlnet = ControlNetModel.from_pretrained("${model.id}")
pipe = StableDiffusionControlNetPipeline.from_pretrained(
	"${get_base_diffusers_model(model)}", controlnet=controlnet
)`
    ];
    var diffusers_lora = (model) => [
      `import torch
from diffusers import DiffusionPipeline

# switch to "mps" for apple devices
pipe = DiffusionPipeline.from_pretrained("${get_base_diffusers_model(model)}", dtype=torch.bfloat16, device_map="cuda")
pipe.load_lora_weights("${model.id}")

prompt = "${get_prompt_from_diffusers_model(model) ?? diffusersDefaultPrompt}"
image = pipe(prompt).images[0]`
    ];
    var diffusers_lora_image_to_image = (model) => [
      `import torch
from diffusers import DiffusionPipeline
from diffusers.utils import load_image

# switch to "mps" for apple devices
pipe = DiffusionPipeline.from_pretrained("${get_base_diffusers_model(model)}", dtype=torch.bfloat16, device_map="cuda")
pipe.load_lora_weights("${model.id}")

prompt = "${get_prompt_from_diffusers_model(model) ?? diffusersImg2ImgDefaultPrompt}"
input_image = load_image("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/cat.png")

image = pipe(image=input_image, prompt=prompt).images[0]`
    ];
    var diffusers_lora_text_to_video = (model) => [
      `import torch
from diffusers import DiffusionPipeline
from diffusers.utils import export_to_video

# switch to "mps" for apple devices
pipe = DiffusionPipeline.from_pretrained("${get_base_diffusers_model(model)}", dtype=torch.bfloat16, device_map="cuda")
pipe.load_lora_weights("${model.id}")

prompt = "${get_prompt_from_diffusers_model(model) ?? diffusersVideoDefaultPrompt}"

output = pipe(prompt=prompt).frames[0]
export_to_video(output, "output.mp4")`
    ];
    var diffusers_lora_image_to_video = (model) => [
      `import torch
from diffusers import DiffusionPipeline
from diffusers.utils import load_image, export_to_video

# switch to "mps" for apple devices
pipe = DiffusionPipeline.from_pretrained("${get_base_diffusers_model(model)}", dtype=torch.bfloat16, device_map="cuda")
pipe.load_lora_weights("${model.id}")

prompt = "${get_prompt_from_diffusers_model(model) ?? diffusersVideoDefaultPrompt}"
input_image = load_image("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/guitar-man.png")

image = pipe(image=input_image, prompt=prompt).frames[0]
export_to_video(output, "output.mp4")`
    ];
    var diffusers_textual_inversion = (model) => [
      `import torch
from diffusers import DiffusionPipeline

# switch to "mps" for apple devices
pipe = DiffusionPipeline.from_pretrained("${get_base_diffusers_model(model)}", dtype=torch.bfloat16, device_map="cuda")
pipe.load_textual_inversion("${model.id}")`
    ];
    var diffusers_flux_fill = (model) => [
      `import torch
from diffusers import FluxFillPipeline
from diffusers.utils import load_image

image = load_image("https://huggingface.co/datasets/diffusers/diffusers-images-docs/resolve/main/cup.png")
mask = load_image("https://huggingface.co/datasets/diffusers/diffusers-images-docs/resolve/main/cup_mask.png")

# switch to "mps" for apple devices
pipe = FluxFillPipeline.from_pretrained("${model.id}", dtype=torch.bfloat16, device_map="cuda")
image = pipe(
    prompt="a white paper cup",
    image=image,
    mask_image=mask,
    height=1632,
    width=1232,
    guidance_scale=30,
    num_inference_steps=50,
    max_sequence_length=512,
    generator=torch.Generator("cpu").manual_seed(0)
).images[0]
image.save(f"flux-fill-dev.png")`
    ];
    var diffusers_inpainting = (model) => [
      `import torch
from diffusers import AutoPipelineForInpainting
from diffusers.utils import load_image

# switch to "mps" for apple devices
pipe = AutoPipelineForInpainting.from_pretrained("${model.id}", dtype=torch.float16, variant="fp16", device_map="cuda")

img_url = "https://raw.githubusercontent.com/CompVis/latent-diffusion/main/data/inpainting_examples/overture-creations-5sI6fQgYIuo.png"
mask_url = "https://raw.githubusercontent.com/CompVis/latent-diffusion/main/data/inpainting_examples/overture-creations-5sI6fQgYIuo_mask.png"

image = load_image(img_url).resize((1024, 1024))
mask_image = load_image(mask_url).resize((1024, 1024))

prompt = "a tiger sitting on a park bench"
generator = torch.Generator(device="cuda").manual_seed(0)

image = pipe(
  prompt=prompt,
  image=image,
  mask_image=mask_image,
  guidance_scale=8.0,
  num_inference_steps=20,  # steps between 15 and 30 work well for us
  strength=0.99,  # make sure to use \`strength\` below 1.0
  generator=generator,
).images[0]`
    ];
    var diffusers = (model) => {
      let codeSnippets;
      if (model.tags.includes("StableDiffusionInpaintPipeline") || model.tags.includes("StableDiffusionXLInpaintPipeline")) {
        codeSnippets = diffusers_inpainting(model);
      } else if (model.tags.includes("controlnet")) {
        codeSnippets = diffusers_controlnet(model);
      } else if (model.tags.includes("lora")) {
        if (model.pipeline_tag === "image-to-image") {
          codeSnippets = diffusers_lora_image_to_image(model);
        } else if (model.pipeline_tag === "image-to-video") {
          codeSnippets = diffusers_lora_image_to_video(model);
        } else if (model.pipeline_tag === "text-to-video") {
          codeSnippets = diffusers_lora_text_to_video(model);
        } else {
          codeSnippets = diffusers_lora(model);
        }
      } else if (model.tags.includes("textual_inversion")) {
        codeSnippets = diffusers_textual_inversion(model);
      } else if (model.tags.includes("FluxFillPipeline")) {
        codeSnippets = diffusers_flux_fill(model);
      } else if (model.pipeline_tag === "image-to-video") {
        codeSnippets = diffusers_image_to_video(model);
      } else if (model.pipeline_tag === "image-to-image") {
        codeSnippets = diffusers_image_to_image(model);
      } else {
        codeSnippets = diffusers_default(model);
      }
      return [diffusers_install, ...codeSnippets];
    };
    exports2.diffusers = diffusers;
    var diffusionkit = (model) => {
      const sd3Snippet = `# Pipeline for Stable Diffusion 3
from diffusionkit.mlx import DiffusionPipeline

pipeline = DiffusionPipeline(
	shift=3.0,
	use_t5=False,
	model_version=${model.id},
	low_memory_mode=True,
	a16=True,
	w16=True,
)`;
      const fluxSnippet = `# Pipeline for Flux
from diffusionkit.mlx import FluxPipeline

pipeline = FluxPipeline(
  shift=1.0,
  model_version=${model.id},
  low_memory_mode=True,
  a16=True,
  w16=True,
)`;
      const generateSnippet = `# Image Generation
HEIGHT = 512
WIDTH = 512
NUM_STEPS = ${model.tags.includes("flux") ? 4 : 50}
CFG_WEIGHT = ${model.tags.includes("flux") ? 0 : 5}

image, _ = pipeline.generate_image(
  "a photo of a cat",
  cfg_weight=CFG_WEIGHT,
  num_steps=NUM_STEPS,
  latent_size=(HEIGHT // 8, WIDTH // 8),
)`;
      const pipelineSnippet = model.tags.includes("flux") ? fluxSnippet : sd3Snippet;
      return [pipelineSnippet, generateSnippet];
    };
    exports2.diffusionkit = diffusionkit;
    var cartesia_pytorch = (model) => [
      `# pip install --no-binary :all: cartesia-pytorch
from cartesia_pytorch import ReneLMHeadModel
from transformers import AutoTokenizer

model = ReneLMHeadModel.from_pretrained("${model.id}")
tokenizer = AutoTokenizer.from_pretrained("allenai/OLMo-1B-hf")

in_message = ["Rene Descartes was"]
inputs = tokenizer(in_message, return_tensors="pt")

outputs = model.generate(inputs.input_ids, max_length=50, top_k=100, top_p=0.99)
out_message = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]

print(out_message)
)`
    ];
    exports2.cartesia_pytorch = cartesia_pytorch;
    var cartesia_mlx = (model) => [
      `import mlx.core as mx
import cartesia_mlx as cmx

model = cmx.from_pretrained("${model.id}")
model.set_dtype(mx.float32)   

prompt = "Rene Descartes was"

for text in model.generate(
    prompt,
    max_tokens=500,
    eval_every_n=5,
    verbose=True,
    top_p=0.99,
    temperature=0.85,
):
    print(text, end="", flush=True)
`
    ];
    exports2.cartesia_mlx = cartesia_mlx;
    var edsnlp = (model) => {
      const packageName = nameWithoutNamespace(model.id).replaceAll("-", "_");
      return [
        `# Load it from the Hub directly
import edsnlp
nlp = edsnlp.load("${model.id}")
`,
        `# Or install it as a package
!pip install git+https://huggingface.co/${model.id}

# and import it as a module
import ${packageName}

nlp = ${packageName}.load()  # or edsnlp.load("${packageName}")
`
      ];
    };
    exports2.edsnlp = edsnlp;
    var espnetTTS = (model) => [
      `from espnet2.bin.tts_inference import Text2Speech

model = Text2Speech.from_pretrained("${model.id}")

speech, *_ = model("text to generate speech from")`
    ];
    exports2.espnetTTS = espnetTTS;
    var espnetASR = (model) => [
      `from espnet2.bin.asr_inference import Speech2Text

model = Speech2Text.from_pretrained(
  "${model.id}"
)

speech, rate = soundfile.read("speech.wav")
text, *_ = model(speech)[0]`
    ];
    exports2.espnetASR = espnetASR;
    var espnetUnknown = () => [`unknown model type (must be text-to-speech or automatic-speech-recognition)`];
    var espnet = (model) => {
      if (model.tags.includes("text-to-speech")) {
        return (0, exports2.espnetTTS)(model);
      } else if (model.tags.includes("automatic-speech-recognition")) {
        return (0, exports2.espnetASR)(model);
      }
      return espnetUnknown();
    };
    exports2.espnet = espnet;
    var fairseq = (model) => [
      `from fairseq.checkpoint_utils import load_model_ensemble_and_task_from_hf_hub

models, cfg, task = load_model_ensemble_and_task_from_hf_hub(
    "${model.id}"
)`
    ];
    exports2.fairseq = fairseq;
    var flair = (model) => [
      `from flair.models import SequenceTagger

tagger = SequenceTagger.load("${model.id}")`
    ];
    exports2.flair = flair;
    var gliner = (model) => [
      `from gliner import GLiNER

model = GLiNER.from_pretrained("${model.id}")`
    ];
    exports2.gliner = gliner;
    var gliner2 = (model) => [
      `from gliner2 import GLiNER2

model = GLiNER2.from_pretrained("${model.id}")

# Extract entities
text = "Apple CEO Tim Cook announced iPhone 15 in Cupertino yesterday."
result = extractor.extract_entities(text, ["company", "person", "product", "location"])

print(result)`
    ];
    exports2.gliner2 = gliner2;
    var indextts = (model) => [
      `# Download model
from huggingface_hub import snapshot_download

snapshot_download(${model.id}, local_dir="checkpoints")

from indextts.infer import IndexTTS

# Ensure config.yaml is present in the checkpoints directory
tts = IndexTTS(model_dir="checkpoints", cfg_path="checkpoints/config.yaml")

voice = "path/to/your/reference_voice.wav"  # Path to the voice reference audio file
text = "Hello, how are you?"
output_path = "output_index.wav"

tts.infer(voice, text, output_path)`
    ];
    exports2.indextts = indextts;
    var htrflow = (model) => [
      `# CLI usage
# see docs: https://ai-riksarkivet.github.io/htrflow/latest/getting_started/quick_start.html
htrflow pipeline <path/to/pipeline.yaml> <path/to/image>`,
      `# Python usage
from htrflow.pipeline.pipeline import Pipeline
from htrflow.pipeline.steps import Task
from htrflow.models.framework.model import ModelClass

pipeline = Pipeline(
    [
        Task(
            ModelClass, {"model": "${model.id}"}, {}
        ),
    ])`
    ];
    exports2.htrflow = htrflow;
    var keras = (model) => [
      `# Available backend options are: "jax", "torch", "tensorflow".
import os
os.environ["KERAS_BACKEND"] = "jax"
	
import keras

model = keras.saving.load_model("hf://${model.id}")
`
    ];
    exports2.keras = keras;
    var _keras_hub_causal_lm = (modelId) => `
import keras_hub

# Load CausalLM model (optional: use half precision for inference)
causal_lm = keras_hub.models.CausalLM.from_preset("hf://${modelId}", dtype="bfloat16")
causal_lm.compile(sampler="greedy")  # (optional) specify a sampler

# Generate text
causal_lm.generate("Keras: deep learning for", max_length=64)
`;
    var _keras_hub_text_to_image = (modelId) => `
import keras_hub

# Load TextToImage model (optional: use half precision for inference)
text_to_image = keras_hub.models.TextToImage.from_preset("hf://${modelId}", dtype="bfloat16")

# Generate images with a TextToImage model.
text_to_image.generate("Astronaut in a jungle")
`;
    var _keras_hub_text_classifier = (modelId) => `
import keras_hub

# Load TextClassifier model
text_classifier = keras_hub.models.TextClassifier.from_preset(
    "hf://${modelId}",
    num_classes=2,
)
# Fine-tune
text_classifier.fit(x=["Thilling adventure!", "Total snoozefest."], y=[1, 0])
# Classify text
text_classifier.predict(["Not my cup of tea."])
`;
    var _keras_hub_image_classifier = (modelId) => `
import keras_hub
import keras

# Load ImageClassifier model
image_classifier = keras_hub.models.ImageClassifier.from_preset(
    "hf://${modelId}",
    num_classes=2,
)
# Fine-tune
image_classifier.fit(
    x=keras.random.randint((32, 64, 64, 3), 0, 256),
    y=keras.random.randint((32, 1), 0, 2),
)
# Classify image
image_classifier.predict(keras.random.randint((1, 64, 64, 3), 0, 256))
`;
    var _keras_hub_tasks_with_example = {
      CausalLM: _keras_hub_causal_lm,
      TextToImage: _keras_hub_text_to_image,
      TextClassifier: _keras_hub_text_classifier,
      ImageClassifier: _keras_hub_image_classifier
    };
    var _keras_hub_task_without_example = (task, modelId) => `
import keras_hub

# Create a ${task} model
task = keras_hub.models.${task}.from_preset("hf://${modelId}")
`;
    var _keras_hub_generic_backbone = (modelId) => `
import keras_hub

# Create a Backbone model unspecialized for any task
backbone = keras_hub.models.Backbone.from_preset("hf://${modelId}")
`;
    var keras_hub = (model) => {
      const modelId = model.id;
      const tasks = model.config?.keras_hub?.tasks ?? [];
      const snippets = [];
      for (const [task, snippet] of Object.entries(_keras_hub_tasks_with_example)) {
        if (tasks.includes(task)) {
          snippets.push(snippet(modelId));
        }
      }
      for (const task of tasks) {
        if (!Object.keys(_keras_hub_tasks_with_example).includes(task)) {
          snippets.push(_keras_hub_task_without_example(task, modelId));
        }
      }
      snippets.push(_keras_hub_generic_backbone(modelId));
      return snippets;
    };
    exports2.keras_hub = keras_hub;
    var kernels = (model) => [
      `# !pip install kernels

from kernels import get_kernel

kernel = get_kernel("${model.id}")`
    ];
    exports2.kernels = kernels;
    var kimi_audio = (model) => [
      `# Example usage for KimiAudio
# pip install git+https://github.com/MoonshotAI/Kimi-Audio.git

from kimia_infer.api.kimia import KimiAudio

model = KimiAudio(model_path="${model.id}", load_detokenizer=True)

sampling_params = {
    "audio_temperature": 0.8,
    "audio_top_k": 10,
    "text_temperature": 0.0,
    "text_top_k": 5,
}

# For ASR
asr_audio = "asr_example.wav"
messages_asr = [
    {"role": "user", "message_type": "text", "content": "Please transcribe the following audio:"},
    {"role": "user", "message_type": "audio", "content": asr_audio}
]
_, text = model.generate(messages_asr, **sampling_params, output_type="text")
print(text)

# For Q&A
qa_audio = "qa_example.wav"
messages_conv = [{"role": "user", "message_type": "audio", "content": qa_audio}]
wav, text = model.generate(messages_conv, **sampling_params, output_type="both")
sf.write("output_audio.wav", wav.cpu().view(-1).numpy(), 24000)
print(text)
`
    ];
    exports2.kimi_audio = kimi_audio;
    var kittentts = (model) => [
      `from kittentts import KittenTTS
m = KittenTTS("${model.id}")

audio = m.generate("This high quality TTS model works without a GPU")

# Save the audio
import soundfile as sf
sf.write('output.wav', audio, 24000)`
    ];
    exports2.kittentts = kittentts;
    var lightning_ir = (model) => {
      if (model.tags.includes("bi-encoder")) {
        return [
          `#install from https://github.com/webis-de/lightning-ir

from lightning_ir import BiEncoderModule
model = BiEncoderModule("${model.id}")

model.score("query", ["doc1", "doc2", "doc3"])`
        ];
      } else if (model.tags.includes("cross-encoder")) {
        return [
          `#install from https://github.com/webis-de/lightning-ir

from lightning_ir import CrossEncoderModule
model = CrossEncoderModule("${model.id}")

model.score("query", ["doc1", "doc2", "doc3"])`
        ];
      }
      return [
        `#install from https://github.com/webis-de/lightning-ir

from lightning_ir import BiEncoderModule, CrossEncoderModule

# depending on the model type, use either BiEncoderModule or CrossEncoderModule
model = BiEncoderModule("${model.id}") 
# model = CrossEncoderModule("${model.id}")

model.score("query", ["doc1", "doc2", "doc3"])`
      ];
    };
    exports2.lightning_ir = lightning_ir;
    var llama_cpp_python = (model) => {
      const snippets = [
        `# !pip install llama-cpp-python

from llama_cpp import Llama

llm = Llama.from_pretrained(
	repo_id="${model.id}",
	filename="{{GGUF_FILE}}",
)
`
      ];
      if (model.tags.includes("conversational")) {
        const messages = (0, inputs_js_1.getModelInputSnippet)(model);
        snippets.push(`llm.create_chat_completion(
	messages = ${(0, common_js_1.stringifyMessages)(messages, { attributeKeyQuotes: true, indent: "	" })}
)`);
      } else {
        snippets.push(`output = llm(
	"Once upon a time,",
	max_tokens=512,
	echo=True
)
print(output)`);
      }
      return snippets;
    };
    exports2.llama_cpp_python = llama_cpp_python;
    var lerobot = (model) => {
      if (model.tags.includes("smolvla")) {
        const smolvlaSnippets = [
          // Installation snippet
          `# See https://github.com/huggingface/lerobot?tab=readme-ov-file#installation for more details
git clone https://github.com/huggingface/lerobot.git
cd lerobot
pip install -e .[smolvla]`,
          // Finetune snippet
          `# Launch finetuning on your dataset
python lerobot/scripts/train.py \\
--policy.path=${model.id} \\
--dataset.repo_id=lerobot/svla_so101_pickplace \\ 
--batch_size=64 \\
--steps=20000 \\
--output_dir=outputs/train/my_smolvla \\
--job_name=my_smolvla_training \\
--policy.device=cuda \\
--wandb.enable=true`
        ];
        if (model.id !== "lerobot/smolvla_base") {
          smolvlaSnippets.push(`# Run the policy using the record function	
python -m lerobot.record \\
  --robot.type=so101_follower \\
  --robot.port=/dev/ttyACM0 \\ # <- Use your port
  --robot.id=my_blue_follower_arm \\ # <- Use your robot id
  --robot.cameras="{ front: {type: opencv, index_or_path: 8, width: 640, height: 480, fps: 30}}" \\ # <- Use your cameras
  --dataset.single_task="Grasp a lego block and put it in the bin." \\ # <- Use the same task description you used in your dataset recording
  --dataset.repo_id=HF_USER/dataset_name \\  # <- This will be the dataset name on HF Hub
  --dataset.episode_time_s=50 \\
  --dataset.num_episodes=10 \\
  --policy.path=${model.id}`);
        }
        return smolvlaSnippets;
      }
      return [];
    };
    exports2.lerobot = lerobot;
    var tf_keras = (model) => [
      `# Note: 'keras<3.x' or 'tf_keras' must be installed (legacy)
# See https://github.com/keras-team/tf-keras for more details.
from huggingface_hub import from_pretrained_keras

model = from_pretrained_keras("${model.id}")
`
    ];
    exports2.tf_keras = tf_keras;
    var mamba_ssm = (model) => [
      `from mamba_ssm import MambaLMHeadModel

model = MambaLMHeadModel.from_pretrained("${model.id}")`
    ];
    exports2.mamba_ssm = mamba_ssm;
    var mars5_tts = (model) => [
      `# Install from https://github.com/Camb-ai/MARS5-TTS

from inference import Mars5TTS
mars5 = Mars5TTS.from_pretrained("${model.id}")`
    ];
    exports2.mars5_tts = mars5_tts;
    var matanyone = (model) => [
      `# Install from https://github.com/pq-yang/MatAnyone.git

from matanyone.model.matanyone import MatAnyone
model = MatAnyone.from_pretrained("${model.id}")`,
      `
from matanyone import InferenceCore
processor = InferenceCore("${model.id}")`
    ];
    exports2.matanyone = matanyone;
    var mesh_anything = () => [
      `# Install from https://github.com/buaacyw/MeshAnything.git

from MeshAnything.models.meshanything import MeshAnything

# refer to https://github.com/buaacyw/MeshAnything/blob/main/main.py#L91 on how to define args
# and https://github.com/buaacyw/MeshAnything/blob/main/app.py regarding usage
model = MeshAnything(args)`
    ];
    exports2.mesh_anything = mesh_anything;
    var open_clip = (model) => [
      `import open_clip

model, preprocess_train, preprocess_val = open_clip.create_model_and_transforms('hf-hub:${model.id}')
tokenizer = open_clip.get_tokenizer('hf-hub:${model.id}')`
    ];
    exports2.open_clip = open_clip;
    var paddlenlp = (model) => {
      if (model.config?.architectures?.[0]) {
        const architecture = model.config.architectures[0];
        return [
          [
            `from paddlenlp.transformers import AutoTokenizer, ${architecture}`,
            "",
            `tokenizer = AutoTokenizer.from_pretrained("${model.id}", from_hf_hub=True)`,
            `model = ${architecture}.from_pretrained("${model.id}", from_hf_hub=True)`
          ].join("\n")
        ];
      } else {
        return [
          [
            `# \u26A0\uFE0F Type of model unknown`,
            `from paddlenlp.transformers import AutoTokenizer, AutoModel`,
            "",
            `tokenizer = AutoTokenizer.from_pretrained("${model.id}", from_hf_hub=True)`,
            `model = AutoModel.from_pretrained("${model.id}", from_hf_hub=True)`
          ].join("\n")
        ];
      }
    };
    exports2.paddlenlp = paddlenlp;
    var paddleocr = (model) => {
      const mapping = {
        textline_detection: { className: "TextDetection" },
        textline_recognition: { className: "TextRecognition" },
        seal_text_detection: { className: "SealTextDetection" },
        doc_img_unwarping: { className: "TextImageUnwarping" },
        doc_img_orientation_classification: { className: "DocImgOrientationClassification" },
        textline_orientation_classification: { className: "TextLineOrientationClassification" },
        chart_parsing: { className: "ChartParsing" },
        formula_recognition: { className: "FormulaRecognition" },
        layout_detection: { className: "LayoutDetection" },
        table_cells_detection: { className: "TableCellsDetection" },
        wired_table_classification: { className: "TableClassification" },
        table_structure_recognition: { className: "TableStructureRecognition" }
      };
      if (model.tags.includes("doc_vlm")) {
        return [
          `# 1. See https://www.paddlepaddle.org.cn/en/install to install paddlepaddle
# 2. pip install paddleocr

from paddleocr import DocVLM
model = DocVLM(model_name="${nameWithoutNamespace(model.id)}")
output = model.predict(
    input={"image": "path/to/image.png", "query": "Parsing this image and output the content in Markdown format."},
    batch_size=1
)
for res in output:
    res.print()
    res.save_to_json(save_path="./output/res.json")`
        ];
      }
      if (model.tags.includes("document-parse")) {
        return [
          `# See https://www.paddleocr.ai/latest/version3.x/pipeline_usage/PaddleOCR-VL.html to installation

from paddleocr import PaddleOCRVL
pipeline = PaddleOCRVL()
output = pipeline.predict("path/to/document_image.png")
for res in output:
	res.print()
	res.save_to_json(save_path="output")
	res.save_to_markdown(save_path="output")`
        ];
      }
      for (const tag of model.tags) {
        if (tag in mapping) {
          const { className } = mapping[tag];
          return [
            `# 1. See https://www.paddlepaddle.org.cn/en/install to install paddlepaddle
# 2. pip install paddleocr

from paddleocr import ${className}
model = ${className}(model_name="${nameWithoutNamespace(model.id)}")
output = model.predict(input="path/to/image.png", batch_size=1)
for res in output:
    res.print()
    res.save_to_img(save_path="./output/")
    res.save_to_json(save_path="./output/res.json")`
          ];
        }
      }
      return [
        `# Please refer to the document for information on how to use the model. 
# https://paddlepaddle.github.io/PaddleOCR/latest/en/version3.x/module_usage/module_overview.html`
      ];
    };
    exports2.paddleocr = paddleocr;
    var perception_encoder = (model) => {
      const clip_model = `# Use PE-Core models as CLIP models
import core.vision_encoder.pe as pe

model = pe.CLIP.from_config("${model.id}", pretrained=True)`;
      const vision_encoder = `# Use any PE model as a vision encoder
import core.vision_encoder.pe as pe

model = pe.VisionTransformer.from_config("${model.id}", pretrained=True)`;
      if (model.id.includes("Core")) {
        return [clip_model, vision_encoder];
      } else {
        return [vision_encoder];
      }
    };
    exports2.perception_encoder = perception_encoder;
    var phantom_wan = (model) => [
      `from huggingface_hub import snapshot_download
from phantom_wan import WANI2V, configs

checkpoint_dir = snapshot_download("${model.id}")
wan_i2v = WanI2V(
            config=configs.WAN_CONFIGS['i2v-14B'],
            checkpoint_dir=checkpoint_dir,
        )
 video = wan_i2v.generate(text_prompt, image_prompt)`
    ];
    exports2.phantom_wan = phantom_wan;
    var pyannote_audio_pipeline = (model) => [
      `from pyannote.audio import Pipeline
  
pipeline = Pipeline.from_pretrained("${model.id}")

# inference on the whole file
pipeline("file.wav")

# inference on an excerpt
from pyannote.core import Segment
excerpt = Segment(start=2.0, end=5.0)

from pyannote.audio import Audio
waveform, sample_rate = Audio().crop("file.wav", excerpt)
pipeline({"waveform": waveform, "sample_rate": sample_rate})`
    ];
    exports2.pyannote_audio_pipeline = pyannote_audio_pipeline;
    var pyannote_audio_model = (model) => [
      `from pyannote.audio import Model, Inference

model = Model.from_pretrained("${model.id}")
inference = Inference(model)

# inference on the whole file
inference("file.wav")

# inference on an excerpt
from pyannote.core import Segment
excerpt = Segment(start=2.0, end=5.0)
inference.crop("file.wav", excerpt)`
    ];
    var pyannote_audio = (model) => {
      if (model.tags.includes("pyannote-audio-pipeline")) {
        return (0, exports2.pyannote_audio_pipeline)(model);
      }
      return pyannote_audio_model(model);
    };
    exports2.pyannote_audio = pyannote_audio;
    var relik = (model) => [
      `from relik import Relik
 
relik = Relik.from_pretrained("${model.id}")`
    ];
    exports2.relik = relik;
    var renderformer = (model) => [
      `# Install from https://github.com/microsoft/renderformer

from renderformer import RenderFormerRenderingPipeline
pipeline = RenderFormerRenderingPipeline.from_pretrained("${model.id}")`
    ];
    exports2.renderformer = renderformer;
    var tensorflowttsTextToMel = (model) => [
      `from tensorflow_tts.inference import AutoProcessor, TFAutoModel

processor = AutoProcessor.from_pretrained("${model.id}")
model = TFAutoModel.from_pretrained("${model.id}")
`
    ];
    var tensorflowttsMelToWav = (model) => [
      `from tensorflow_tts.inference import TFAutoModel

model = TFAutoModel.from_pretrained("${model.id}")
audios = model.inference(mels)
`
    ];
    var tensorflowttsUnknown = (model) => [
      `from tensorflow_tts.inference import TFAutoModel

model = TFAutoModel.from_pretrained("${model.id}")
`
    ];
    var tensorflowtts = (model) => {
      if (model.tags.includes("text-to-mel")) {
        return tensorflowttsTextToMel(model);
      } else if (model.tags.includes("mel-to-wav")) {
        return tensorflowttsMelToWav(model);
      }
      return tensorflowttsUnknown(model);
    };
    exports2.tensorflowtts = tensorflowtts;
    var timm = (model) => [
      `import timm

model = timm.create_model("hf_hub:${model.id}", pretrained=True)`
    ];
    exports2.timm = timm;
    var saelens = () => [
      `# pip install sae-lens
from sae_lens import SAE

sae, cfg_dict, sparsity = SAE.from_pretrained(
    release = "RELEASE_ID", # e.g., "gpt2-small-res-jb". See other options in https://github.com/jbloomAus/SAELens/blob/main/sae_lens/pretrained_saes.yaml
    sae_id = "SAE_ID", # e.g., "blocks.8.hook_resid_pre". Won't always be a hook point
)`
    ];
    exports2.saelens = saelens;
    var seed_story = () => [
      `# seed_story_cfg_path refers to 'https://github.com/TencentARC/SEED-Story/blob/master/configs/clm_models/agent_7b_sft.yaml'
# llm_cfg_path refers to 'https://github.com/TencentARC/SEED-Story/blob/master/configs/clm_models/llama2chat7b_lora.yaml'
from omegaconf import OmegaConf
import hydra

# load Llama2
llm_cfg = OmegaConf.load(llm_cfg_path)
llm = hydra.utils.instantiate(llm_cfg, torch_dtype="fp16")

# initialize seed_story
seed_story_cfg = OmegaConf.load(seed_story_cfg_path)
seed_story = hydra.utils.instantiate(seed_story_cfg, llm=llm) `
    ];
    exports2.seed_story = seed_story;
    var skopsPickle = (model, modelFile) => {
      return [
        `import joblib
from skops.hub_utils import download
download("${model.id}", "path_to_folder")
model = joblib.load(
	"${modelFile}"
)
# only load pickle files from sources you trust
# read more about it here https://skops.readthedocs.io/en/stable/persistence.html`
      ];
    };
    var skopsFormat = (model, modelFile) => {
      return [
        `from skops.hub_utils import download
from skops.io import load
download("${model.id}", "path_to_folder")
# make sure model file is in skops format
# if model is a pickle file, make sure it's from a source you trust
model = load("path_to_folder/${modelFile}")`
      ];
    };
    var skopsJobLib = (model) => {
      return [
        `from huggingface_hub import hf_hub_download
import joblib
model = joblib.load(
	hf_hub_download("${model.id}", "sklearn_model.joblib")
)
# only load pickle files from sources you trust
# read more about it here https://skops.readthedocs.io/en/stable/persistence.html`
      ];
    };
    var sklearn = (model) => {
      if (model.tags.includes("skops")) {
        const skopsmodelFile = model.config?.sklearn?.model?.file;
        const skopssaveFormat = model.config?.sklearn?.model_format;
        if (!skopsmodelFile) {
          return [`# \u26A0\uFE0F Model filename not specified in config.json`];
        }
        if (skopssaveFormat === "pickle") {
          return skopsPickle(model, skopsmodelFile);
        } else {
          return skopsFormat(model, skopsmodelFile);
        }
      } else {
        return skopsJobLib(model);
      }
    };
    exports2.sklearn = sklearn;
    var stable_audio_tools = (model) => [
      `import torch
import torchaudio
from einops import rearrange
from stable_audio_tools import get_pretrained_model
from stable_audio_tools.inference.generation import generate_diffusion_cond

device = "cuda" if torch.cuda.is_available() else "cpu"

# Download model
model, model_config = get_pretrained_model("${model.id}")
sample_rate = model_config["sample_rate"]
sample_size = model_config["sample_size"]

model = model.to(device)

# Set up text and timing conditioning
conditioning = [{
	"prompt": "128 BPM tech house drum loop",
}]

# Generate stereo audio
output = generate_diffusion_cond(
	model,
	conditioning=conditioning,
	sample_size=sample_size,
	device=device
)

# Rearrange audio batch to a single sequence
output = rearrange(output, "b d n -> d (b n)")

# Peak normalize, clip, convert to int16, and save to file
output = output.to(torch.float32).div(torch.max(torch.abs(output))).clamp(-1, 1).mul(32767).to(torch.int16).cpu()
torchaudio.save("output.wav", output, sample_rate)`
    ];
    exports2.stable_audio_tools = stable_audio_tools;
    var fastai = (model) => [
      `from huggingface_hub import from_pretrained_fastai

learn = from_pretrained_fastai("${model.id}")`
    ];
    exports2.fastai = fastai;
    var sam2 = (model) => {
      const image_predictor = `# Use SAM2 with images
import torch
from sam2.sam2_image_predictor import SAM2ImagePredictor

predictor = SAM2ImagePredictor.from_pretrained(${model.id})

with torch.inference_mode(), torch.autocast("cuda", dtype=torch.bfloat16):
    predictor.set_image(<your_image>)
    masks, _, _ = predictor.predict(<input_prompts>)`;
      const video_predictor = `# Use SAM2 with videos
import torch
from sam2.sam2_video_predictor import SAM2VideoPredictor
	
predictor = SAM2VideoPredictor.from_pretrained(${model.id})

with torch.inference_mode(), torch.autocast("cuda", dtype=torch.bfloat16):
    state = predictor.init_state(<your_video>)

    # add new prompts and instantly get the output on the same frame
    frame_idx, object_ids, masks = predictor.add_new_points(state, <your_prompts>):

    # propagate the prompts to get masklets throughout the video
    for frame_idx, object_ids, masks in predictor.propagate_in_video(state):
        ...`;
      return [image_predictor, video_predictor];
    };
    exports2.sam2 = sam2;
    var sam_3d_objects = (model) => [
      `from inference import Inference, load_image, load_single_mask
from huggingface_hub import hf_hub_download

path = hf_hub_download("${model.id}", "pipeline.yaml")
inference = Inference(path, compile=False)

image = load_image("path_to_image.png")
mask = load_single_mask("path_to_mask.png", index=14)

output = inference(image, mask)`
    ];
    exports2.sam_3d_objects = sam_3d_objects;
    var sam_3d_body = (model) => [
      `from notebook.utils import setup_sam_3d_body

estimator = setup_sam_3d_body(${model.id})
outputs = estimator.process_one_image(image)
rend_img = visualize_sample_together(image, outputs, estimator.faces)`
    ];
    exports2.sam_3d_body = sam_3d_body;
    var sampleFactory = (model) => [
      `python -m sample_factory.huggingface.load_from_hub -r ${model.id} -d ./train_dir`
    ];
    exports2.sampleFactory = sampleFactory;
    function get_widget_examples_from_st_model(model) {
      const widgetExample = model.widgetData?.[0];
      if (widgetExample?.source_sentence && widgetExample?.sentences?.length) {
        return [widgetExample.source_sentence, ...widgetExample.sentences];
      }
    }
    var sentenceTransformers = (model) => {
      const remote_code_snippet = model.tags.includes(TAG_CUSTOM_CODE) ? ", trust_remote_code=True" : "";
      if (model.tags.includes("PyLate")) {
        return [
          `from pylate import models

queries = [
    "Which planet is known as the Red Planet?",
    "What is the largest planet in our solar system?",
]

documents = [
    ["Mars is the Red Planet.", "Venus is Earth's twin."],
    ["Jupiter is the largest planet.", "Saturn has rings."],
]

model = models.ColBERT(model_name_or_path="${model.id}")

queries_emb = model.encode(queries, is_query=True)
docs_emb = model.encode(documents, is_query=False)`
        ];
      }
      if (model.tags.includes("cross-encoder") || model.pipeline_tag == "text-ranking") {
        return [
          `from sentence_transformers import CrossEncoder

model = CrossEncoder("${model.id}"${remote_code_snippet})

query = "Which planet is known as the Red Planet?"
passages = [
	"Venus is often called Earth's twin because of its similar size and proximity.",
	"Mars, known for its reddish appearance, is often referred to as the Red Planet.",
	"Jupiter, the largest planet in our solar system, has a prominent red spot.",
	"Saturn, famous for its rings, is sometimes mistaken for the Red Planet."
]

scores = model.predict([(query, passage) for passage in passages])
print(scores)`
        ];
      }
      const exampleSentences = get_widget_examples_from_st_model(model) ?? [
        "The weather is lovely today.",
        "It's so sunny outside!",
        "He drove to the stadium."
      ];
      return [
        `from sentence_transformers import SentenceTransformer

model = SentenceTransformer("${model.id}"${remote_code_snippet})

sentences = ${JSON.stringify(exampleSentences, null, 4)}
embeddings = model.encode(sentences)

similarities = model.similarity(embeddings, embeddings)
print(similarities.shape)
# [${exampleSentences.length}, ${exampleSentences.length}]`
      ];
    };
    exports2.sentenceTransformers = sentenceTransformers;
    var setfit = (model) => [
      `from setfit import SetFitModel

model = SetFitModel.from_pretrained("${model.id}")`
    ];
    exports2.setfit = setfit;
    var spacy = (model) => [
      `!pip install https://huggingface.co/${model.id}/resolve/main/${nameWithoutNamespace(model.id)}-any-py3-none-any.whl

# Using spacy.load().
import spacy
nlp = spacy.load("${nameWithoutNamespace(model.id)}")

# Importing as module.
import ${nameWithoutNamespace(model.id)}
nlp = ${nameWithoutNamespace(model.id)}.load()`
    ];
    exports2.spacy = spacy;
    var span_marker = (model) => [
      `from span_marker import SpanMarkerModel

model = SpanMarkerModel.from_pretrained("${model.id}")`
    ];
    exports2.span_marker = span_marker;
    var stanza = (model) => [
      `import stanza

stanza.download("${nameWithoutNamespace(model.id).replace("stanza-", "")}")
nlp = stanza.Pipeline("${nameWithoutNamespace(model.id).replace("stanza-", "")}")`
    ];
    exports2.stanza = stanza;
    var speechBrainMethod = (speechbrainInterface) => {
      switch (speechbrainInterface) {
        case "EncoderClassifier":
          return "classify_file";
        case "EncoderDecoderASR":
        case "EncoderASR":
          return "transcribe_file";
        case "SpectralMaskEnhancement":
          return "enhance_file";
        case "SepformerSeparation":
          return "separate_file";
        default:
          return void 0;
      }
    };
    var speechbrain = (model) => {
      const speechbrainInterface = model.config?.speechbrain?.speechbrain_interface;
      if (speechbrainInterface === void 0) {
        return [`# interface not specified in config.json`];
      }
      const speechbrainMethod = speechBrainMethod(speechbrainInterface);
      if (speechbrainMethod === void 0) {
        return [`# interface in config.json invalid`];
      }
      return [
        `from speechbrain.pretrained import ${speechbrainInterface}
model = ${speechbrainInterface}.from_hparams(
  "${model.id}"
)
model.${speechbrainMethod}("file.wav")`
      ];
    };
    exports2.speechbrain = speechbrain;
    var terratorch = (model) => [
      `from terratorch.registry import BACKBONE_REGISTRY

model = BACKBONE_REGISTRY.build("${model.id}")`
    ];
    exports2.terratorch = terratorch;
    var hasChatTemplate = (model) => model.config?.tokenizer_config?.chat_template !== void 0 || model.config?.processor_config?.chat_template !== void 0 || model.config?.chat_template_jinja !== void 0;
    var transformers = (model) => {
      const info = model.transformersInfo;
      if (!info) {
        return [`# \u26A0\uFE0F Type of model unknown`];
      }
      const remote_code_snippet = model.tags.includes(TAG_CUSTOM_CODE) ? ", trust_remote_code=True" : "";
      const autoSnippet = [];
      if (info.processor) {
        const processorVarName = info.processor === "AutoTokenizer" ? "tokenizer" : info.processor === "AutoFeatureExtractor" ? "extractor" : "processor";
        autoSnippet.push("# Load model directly", `from transformers import ${info.processor}, ${info.auto_model}`, "", `${processorVarName} = ${info.processor}.from_pretrained("${model.id}"` + remote_code_snippet + ")", `model = ${info.auto_model}.from_pretrained("${model.id}"` + remote_code_snippet + ")");
        if (model.tags.includes("conversational") && hasChatTemplate(model)) {
          if (model.tags.includes("image-text-to-text")) {
            autoSnippet.push("messages = [", [
              "    {",
              '        "role": "user",',
              '        "content": [',
              '            {"type": "image", "url": "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/p-blog/candy.JPG"},',
              '            {"type": "text", "text": "What animal is on the candy?"}',
              "        ]",
              "    },"
            ].join("\n"), "]");
          } else {
            autoSnippet.push("messages = [", '    {"role": "user", "content": "Who are you?"},', "]");
          }
          autoSnippet.push(`inputs = ${processorVarName}.apply_chat_template(`, "	messages,", "	add_generation_prompt=True,", "	tokenize=True,", "	return_dict=True,", '	return_tensors="pt",', ").to(model.device)", "", "outputs = model.generate(**inputs, max_new_tokens=40)", `print(${processorVarName}.decode(outputs[0][inputs["input_ids"].shape[-1]:]))`);
        }
      } else {
        autoSnippet.push("# Load model directly", `from transformers import ${info.auto_model}`, `model = ${info.auto_model}.from_pretrained("${model.id}"` + remote_code_snippet + ', dtype="auto")');
      }
      if (model.pipeline_tag && library_to_tasks_js_1.LIBRARY_TASK_MAPPING.transformers?.includes(model.pipeline_tag)) {
        const pipelineSnippet = [
          "# Use a pipeline as a high-level helper",
          "from transformers import pipeline",
          "",
          `pipe = pipeline("${model.pipeline_tag}", model="${model.id}"` + remote_code_snippet + ")"
        ];
        if (model.tags.includes("conversational")) {
          if (model.tags.includes("image-text-to-text")) {
            pipelineSnippet.push("messages = [", [
              "    {",
              '        "role": "user",',
              '        "content": [',
              '            {"type": "image", "url": "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/p-blog/candy.JPG"},',
              '            {"type": "text", "text": "What animal is on the candy?"}',
              "        ]",
              "    },"
            ].join("\n"), "]");
            pipelineSnippet.push("pipe(text=messages)");
          } else {
            pipelineSnippet.push("messages = [", '    {"role": "user", "content": "Who are you?"},', "]");
            pipelineSnippet.push("pipe(messages)");
          }
        } else if (model.pipeline_tag === "zero-shot-image-classification") {
          pipelineSnippet.push("pipe(", '    "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/hub/parrots.png",', '    candidate_labels=["animals", "humans", "landscape"],', ")");
        } else if (model.pipeline_tag === "image-classification") {
          pipelineSnippet.push('pipe("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/hub/parrots.png")');
        }
        return [pipelineSnippet.join("\n"), autoSnippet.join("\n")];
      }
      return [autoSnippet.join("\n")];
    };
    exports2.transformers = transformers;
    var transformersJS = (model) => {
      if (!model.pipeline_tag) {
        return [`// \u26A0\uFE0F Unknown pipeline tag`];
      }
      const libName = "@huggingface/transformers";
      return [
        `// npm i ${libName}
import { pipeline } from '${libName}';

// Allocate pipeline
const pipe = await pipeline('${model.pipeline_tag}', '${model.id}');`
      ];
    };
    exports2.transformersJS = transformersJS;
    var peftTask = (peftTaskType) => {
      switch (peftTaskType) {
        case "CAUSAL_LM":
          return "CausalLM";
        case "SEQ_2_SEQ_LM":
          return "Seq2SeqLM";
        case "TOKEN_CLS":
          return "TokenClassification";
        case "SEQ_CLS":
          return "SequenceClassification";
        default:
          return void 0;
      }
    };
    var peft = (model) => {
      const { base_model_name_or_path: peftBaseModel, task_type: peftTaskType } = model.config?.peft ?? {};
      const pefttask = peftTask(peftTaskType);
      if (!pefttask) {
        return [`Task type is invalid.`];
      }
      if (!peftBaseModel) {
        return [`Base model is not found.`];
      }
      return [
        `from peft import PeftModel
from transformers import AutoModelFor${pefttask}

base_model = AutoModelFor${pefttask}.from_pretrained("${peftBaseModel}")
model = PeftModel.from_pretrained(base_model, "${model.id}")`
      ];
    };
    exports2.peft = peft;
    var fasttext = (model) => [
      `from huggingface_hub import hf_hub_download
import fasttext

model = fasttext.load_model(hf_hub_download("${model.id}", "model.bin"))`
    ];
    exports2.fasttext = fasttext;
    var stableBaselines3 = (model) => [
      `from huggingface_sb3 import load_from_hub
checkpoint = load_from_hub(
	repo_id="${model.id}",
	filename="{MODEL FILENAME}.zip",
)`
    ];
    exports2.stableBaselines3 = stableBaselines3;
    var nemoDomainResolver = (domain, model) => {
      switch (domain) {
        case "ASR":
          return [
            `import nemo.collections.asr as nemo_asr
asr_model = nemo_asr.models.ASRModel.from_pretrained("${model.id}")

transcriptions = asr_model.transcribe(["file.wav"])`
          ];
        default:
          return void 0;
      }
    };
    var mlAgents = (model) => [
      `mlagents-load-from-hf --repo-id="${model.id}" --local-dir="./download: string[]s"`
    ];
    exports2.mlAgents = mlAgents;
    var sentis = () => [
      `string modelName = "[Your model name here].sentis";
Model model = ModelLoader.Load(Application.streamingAssetsPath + "/" + modelName);
IWorker engine = WorkerFactory.CreateWorker(BackendType.GPUCompute, model);
// Please see provided C# file for more details
`
    ];
    exports2.sentis = sentis;
    var sana = (model) => [
      `
# Load the model and infer image from text
import torch
from app.sana_pipeline import SanaPipeline
from torchvision.utils import save_image

sana = SanaPipeline("configs/sana_config/1024ms/Sana_1600M_img1024.yaml")
sana.from_pretrained("hf://${model.id}")

image = sana(
    prompt='a cyberpunk cat with a neon sign that says "Sana"',
    height=1024,
    width=1024,
    guidance_scale=5.0,
    pag_guidance_scale=2.0,
    num_inference_steps=18,
) `
    ];
    exports2.sana = sana;
    var vibevoice = (model) => [
      `import torch, soundfile as sf, librosa, numpy as np
from vibevoice.processor.vibevoice_processor import VibeVoiceProcessor
from vibevoice.modular.modeling_vibevoice_inference import VibeVoiceForConditionalGenerationInference

# Load voice sample (should be 24kHz mono)
voice, sr = sf.read("path/to/voice_sample.wav")
if voice.ndim > 1: voice = voice.mean(axis=1)
if sr != 24000: voice = librosa.resample(voice, sr, 24000)

processor = VibeVoiceProcessor.from_pretrained("${model.id}")
model = VibeVoiceForConditionalGenerationInference.from_pretrained(
    "${model.id}", torch_dtype=torch.bfloat16
).to("cuda").eval()
model.set_ddpm_inference_steps(5)

inputs = processor(text=["Speaker 0: Hello!\\nSpeaker 1: Hi there!"],
                   voice_samples=[[voice]], return_tensors="pt")
audio = model.generate(**inputs, cfg_scale=1.3,
                       tokenizer=processor.tokenizer).speech_outputs[0]
sf.write("output.wav", audio.cpu().numpy().squeeze(), 24000)`
    ];
    exports2.vibevoice = vibevoice;
    var videoprism = (model) => [
      `# Install from https://github.com/google-deepmind/videoprism
import jax
from videoprism import models as vp

flax_model = vp.get_model("${model.id}")
loaded_state = vp.load_pretrained_weights("${model.id}")

@jax.jit
def forward_fn(inputs, train=False):
  return flax_model.apply(loaded_state, inputs, train=train)`
    ];
    exports2.videoprism = videoprism;
    var vfimamba = (model) => [
      `from Trainer_finetune import Model

model = Model.from_pretrained("${model.id}")`
    ];
    exports2.vfimamba = vfimamba;
    var lvface = (model) => [
      `from huggingface_hub import hf_hub_download
	 from inference_onnx import LVFaceONNXInferencer

model_path = hf_hub_download("${model.id}", "LVFace-L_Glint360K/LVFace-L_Glint360K.onnx")
inferencer = LVFaceONNXInferencer(model_path, use_gpu=True, timeout=300)
img_path = 'path/to/image1.jpg'
embedding = inferencer.infer_from_image(img_path)`
    ];
    exports2.lvface = lvface;
    var voicecraft = (model) => [
      `from voicecraft import VoiceCraft

model = VoiceCraft.from_pretrained("${model.id}")`
    ];
    exports2.voicecraft = voicecraft;
    var voxcpm = (model) => [
      `import soundfile as sf
from voxcpm import VoxCPM

model = VoxCPM.from_pretrained("${model.id}")

wav = model.generate(
    text="VoxCPM is an innovative end-to-end TTS model from ModelBest, designed to generate highly expressive speech.",
    prompt_wav_path=None,      # optional: path to a prompt speech for voice cloning
    prompt_text=None,          # optional: reference text
    cfg_value=2.0,             # LM guidance on LocDiT, higher for better adherence to the prompt, but maybe worse
    inference_timesteps=10,   # LocDiT inference timesteps, higher for better result, lower for fast speed
    normalize=True,           # enable external TN tool
    denoise=True,             # enable external Denoise tool
    retry_badcase=True,        # enable retrying mode for some bad cases (unstoppable)
    retry_badcase_max_times=3,  # maximum retrying times
    retry_badcase_ratio_threshold=6.0, # maximum length restriction for bad case detection (simple but effective), it could be adjusted for slow pace speech
)

sf.write("output.wav", wav, 16000)
print("saved: output.wav")`
    ];
    exports2.voxcpm = voxcpm;
    var vui = () => [
      `# !pip install git+https://github.com/fluxions-ai/vui

import torchaudio

from vui.inference import render
from vui.model import Vui,

model = Vui.from_pretrained().cuda()
waveform = render(
    model,
    "Hey, here is some random stuff, usually something quite long as the shorter the text the less likely the model can cope!",
)
print(waveform.shape)
torchaudio.save("out.opus", waveform[0], 22050)
`
    ];
    exports2.vui = vui;
    var chattts = () => [
      `import ChatTTS
import torchaudio

chat = ChatTTS.Chat()
chat.load_models(compile=False) # Set to True for better performance

texts = ["PUT YOUR TEXT HERE",]

wavs = chat.infer(texts, )

torchaudio.save("output1.wav", torch.from_numpy(wavs[0]), 24000)`
    ];
    exports2.chattts = chattts;
    var ultralytics = (model) => {
      const versionTag = model.tags.find((tag) => tag.match(/^yolov\d+$/));
      const className = versionTag ? `YOLOv${versionTag.slice(4)}` : "YOLOvXX";
      const prefix = versionTag ? "" : `# Couldn't find a valid YOLO version tag.
# Replace XX with the correct version.
`;
      return [
        prefix + `from ultralytics import ${className}

model = ${className}.from_pretrained("${model.id}")
source = 'http://images.cocodataset.org/val2017/000000039769.jpg'
model.predict(source=source, save=True)`
      ];
    };
    exports2.ultralytics = ultralytics;
    var birefnet = (model) => [
      `# Option 1: use with transformers

from transformers import AutoModelForImageSegmentation
birefnet = AutoModelForImageSegmentation.from_pretrained("${model.id}", trust_remote_code=True)
`,
      `# Option 2: use with BiRefNet

# Install from https://github.com/ZhengPeng7/BiRefNet

from models.birefnet import BiRefNet
model = BiRefNet.from_pretrained("${model.id}")`
    ];
    exports2.birefnet = birefnet;
    var supertonic = () => [
      `from supertonic import TTS

tts = TTS(auto_download=True)

style = tts.get_voice_style(voice_name="M1")

text = "The train delay was announced at 4:45 PM on Wed, Apr 3, 2024 due to track maintenance."
wav, duration = tts.synthesize(text, voice_style=style)

tts.save_audio(wav, "output.wav")`
    ];
    exports2.supertonic = supertonic;
    var swarmformer = (model) => [
      `from swarmformer import SwarmFormerModel

model = SwarmFormerModel.from_pretrained("${model.id}")
`
    ];
    exports2.swarmformer = swarmformer;
    var univa = (model) => [
      `# Follow installation instructions at https://github.com/PKU-YuanGroup/UniWorld-V1

from univa.models.qwen2p5vl.modeling_univa_qwen2p5vl import UnivaQwen2p5VLForConditionalGeneration
	model = UnivaQwen2p5VLForConditionalGeneration.from_pretrained(
        "${model.id}",
        torch_dtype=torch.bfloat16,
        attn_implementation="flash_attention_2",
    ).to("cuda")
	processor = AutoProcessor.from_pretrained("${model.id}")
`
    ];
    exports2.univa = univa;
    var mlx_unknown = (model) => [
      `# Download the model from the Hub
pip install huggingface_hub[hf_xet]

huggingface-cli download --local-dir ${nameWithoutNamespace(model.id)} ${model.id}`
    ];
    var mlxlm = (model) => [
      `# Make sure mlx-lm is installed
# pip install --upgrade mlx-lm
# if on a CUDA device, also pip install mlx[cuda]

# Generate text with mlx-lm
from mlx_lm import load, generate

model, tokenizer = load("${model.id}")

prompt = "Once upon a time in"
text = generate(model, tokenizer, prompt=prompt, verbose=True)`
    ];
    var mlxchat = (model) => [
      `# Make sure mlx-lm is installed
# pip install --upgrade mlx-lm

# Generate text with mlx-lm
from mlx_lm import load, generate

model, tokenizer = load("${model.id}")

prompt = "Write a story about Einstein"
messages = [{"role": "user", "content": prompt}]
prompt = tokenizer.apply_chat_template(
    messages, add_generation_prompt=True
)

text = generate(model, tokenizer, prompt=prompt, verbose=True)`
    ];
    var mlxvlm = (model) => [
      `# Make sure mlx-vlm is installed
# pip install --upgrade mlx-vlm

from mlx_vlm import load, generate
from mlx_vlm.prompt_utils import apply_chat_template
from mlx_vlm.utils import load_config

# Load the model
model, processor = load("${model.id}")
config = load_config("${model.id}")

# Prepare input
image = ["http://images.cocodataset.org/val2017/000000039769.jpg"]
prompt = "Describe this image."

# Apply chat template
formatted_prompt = apply_chat_template(
    processor, config, prompt, num_images=1
)

# Generate output
output = generate(model, processor, formatted_prompt, image)
print(output)`
    ];
    var mlxim = (model) => [
      `from mlxim.model import create_model

model = create_model(${model.id})`
    ];
    exports2.mlxim = mlxim;
    var mlx = (model) => {
      if (model.pipeline_tag === "image-text-to-text") {
        return mlxvlm(model);
      }
      if (model.pipeline_tag === "text-generation") {
        if (model.tags.includes("conversational")) {
          return mlxchat(model);
        } else {
          return mlxlm(model);
        }
      }
      return mlx_unknown(model);
    };
    exports2.mlx = mlx;
    var model2vec = (model) => [
      `from model2vec import StaticModel

model = StaticModel.from_pretrained("${model.id}")`
    ];
    exports2.model2vec = model2vec;
    var pruna = (model) => {
      let snippets;
      if (model.tags.includes("diffusers")) {
        snippets = pruna_diffusers(model);
      } else if (model.tags.includes("transformers")) {
        snippets = pruna_transformers(model);
      } else {
        snippets = pruna_default(model);
      }
      const ensurePrunaModelImport = (snippet) => {
        if (!/^from pruna import PrunaModel/m.test(snippet)) {
          return `from pruna import PrunaModel
${snippet}`;
        }
        return snippet;
      };
      snippets = snippets.map(ensurePrunaModelImport);
      if (model.tags.includes("pruna_pro-ai")) {
        return snippets.map((snippet) => snippet.replace(/\bpruna\b/g, "pruna_pro").replace(/\bPrunaModel\b/g, "PrunaProModel"));
      }
      return snippets;
    };
    exports2.pruna = pruna;
    var pruna_diffusers = (model) => {
      const diffusersSnippets = (0, exports2.diffusers)(model);
      return diffusersSnippets.map((snippet) => snippet.replace(/\b\w*Pipeline\w*\b/g, "PrunaModel").replace(/from diffusers import ([^,\n]*PrunaModel[^,\n]*)/g, "").replace(/from diffusers import ([^,\n]+),?\s*([^,\n]*PrunaModel[^,\n]*)/g, "from diffusers import $1").replace(/from diffusers import\s*(\n|$)/g, "").replace(/from diffusers import PrunaModel/g, "from pruna import PrunaModel").replace(/from diffusers import ([^,\n]+), PrunaModel/g, "from diffusers import $1").replace(/from diffusers import PrunaModel, ([^,\n]+)/g, "from diffusers import $1").replace(/\n\n+/g, "\n").trim());
    };
    var pruna_transformers = (model) => {
      const info = model.transformersInfo;
      const transformersSnippets = (0, exports2.transformers)(model);
      let processedSnippets = transformersSnippets.map((snippet) => snippet.replace(/from transformers import pipeline/g, "from pruna import PrunaModel").replace(/pipeline\([^)]*\)/g, `PrunaModel.from_pretrained("${model.id}")`));
      if (info?.auto_model) {
        processedSnippets = processedSnippets.map((snippet) => snippet.replace(new RegExp(`from transformers import ${info.auto_model}
?`, "g"), "").replace(new RegExp(`${info.auto_model}.from_pretrained`, "g"), "PrunaModel.from_pretrained").replace(new RegExp(`^.*from.*import.*(, *${info.auto_model})+.*$`, "gm"), (line) => line.replace(new RegExp(`, *${info.auto_model}`, "g"), "")));
      }
      return processedSnippets;
    };
    var pruna_default = (model) => [
      `from pruna import PrunaModel
model = PrunaModel.from_pretrained("${model.id}")
`
    ];
    var nemo = (model) => {
      let command = void 0;
      if (model.tags.includes("automatic-speech-recognition")) {
        command = nemoDomainResolver("ASR", model);
      }
      return command ?? [`# tag did not correspond to a valid NeMo domain.`];
    };
    exports2.nemo = nemo;
    var outetts = (model) => {
      const t = model.tags ?? [];
      if (t.includes("gguf") || t.includes("onnx"))
        return [];
      return [
        `
  import outetts
  
  enum = outetts.Models("${model.id}".split("/", 1)[1])       # VERSION_1_0_SIZE_1B
  cfg  = outetts.ModelConfig.auto_config(enum, outetts.Backend.HF)
  tts  = outetts.Interface(cfg)
  
  speaker = tts.load_default_speaker("EN-FEMALE-1-NEUTRAL")
  tts.generate(
	  outetts.GenerationConfig(
		  text="Hello there, how are you doing?",
		  speaker=speaker,
	  )
  ).save("output.wav")
  `
      ];
    };
    exports2.outetts = outetts;
    var pxia = (model) => [
      `from pxia import AutoModel

model = AutoModel.from_pretrained("${model.id}")`
    ];
    exports2.pxia = pxia;
    var pythae = (model) => [
      `from pythae.models import AutoModel

model = AutoModel.load_from_hf_hub("${model.id}")`
    ];
    exports2.pythae = pythae;
    var musicgen = (model) => [
      `from audiocraft.models import MusicGen

model = MusicGen.get_pretrained("${model.id}")

descriptions = ['happy rock', 'energetic EDM', 'sad jazz']
wav = model.generate(descriptions)  # generates 3 samples.`
    ];
    var magnet = (model) => [
      `from audiocraft.models import MAGNeT
	
model = MAGNeT.get_pretrained("${model.id}")

descriptions = ['disco beat', 'energetic EDM', 'funky groove']
wav = model.generate(descriptions)  # generates 3 samples.`
    ];
    var audiogen = (model) => [
      `from audiocraft.models import AudioGen
	
model = AudioGen.get_pretrained("${model.id}")
model.set_generation_params(duration=5)  # generate 5 seconds.
descriptions = ['dog barking', 'sirene of an emergency vehicle', 'footsteps in a corridor']
wav = model.generate(descriptions)  # generates 3 samples.`
    ];
    var anemoi = (model) => [
      `from anemoi.inference.runners.default import DefaultRunner
from anemoi.inference.config.run import RunConfiguration
# Create Configuration
config = RunConfiguration(checkpoint = {"huggingface":"${model.id}"})
# Load Runner
runner = DefaultRunner(config)`
    ];
    exports2.anemoi = anemoi;
    var audiocraft = (model) => {
      if (model.tags.includes("musicgen")) {
        return musicgen(model);
      } else if (model.tags.includes("audiogen")) {
        return audiogen(model);
      } else if (model.tags.includes("magnet")) {
        return magnet(model);
      } else {
        return [`# Type of model unknown.`];
      }
    };
    exports2.audiocraft = audiocraft;
    var whisperkit = () => [
      `# Install CLI with Homebrew on macOS device
brew install whisperkit-cli

# View all available inference options
whisperkit-cli transcribe --help
	
# Download and run inference using whisper base model
whisperkit-cli transcribe --audio-path /path/to/audio.mp3

# Or use your preferred model variant
whisperkit-cli transcribe --model "large-v3" --model-prefix "distil" --audio-path /path/to/audio.mp3 --verbose`
    ];
    exports2.whisperkit = whisperkit;
    var threedtopia_xl = (model) => [
      `from threedtopia_xl.models import threedtopia_xl

model = threedtopia_xl.from_pretrained("${model.id}")
model.generate(cond="path/to/image.png")`
    ];
    exports2.threedtopia_xl = threedtopia_xl;
    var hezar = (model) => [
      `from hezar import Model

model = Model.load("${model.id}")`
    ];
    exports2.hezar = hezar;
    var zonos = (model) => [
      `# pip install git+https://github.com/Zyphra/Zonos.git
import torchaudio
from zonos.model import Zonos
from zonos.conditioning import make_cond_dict

model = Zonos.from_pretrained("${model.id}", device="cuda")

wav, sr = torchaudio.load("speaker.wav")           # 5-10s reference clip
speaker = model.make_speaker_embedding(wav, sr)

cond  = make_cond_dict(text="Hello, world!", speaker=speaker, language="en-us")
codes = model.generate(model.prepare_conditioning(cond))

audio = model.autoencoder.decode(codes)[0].cpu()
torchaudio.save("sample.wav", audio, model.autoencoder.sampling_rate)
`
    ];
    exports2.zonos = zonos;
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/model-libraries.js
var require_model_libraries = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/model-libraries.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ALL_DISPLAY_MODEL_LIBRARY_KEYS = exports2.ALL_MODEL_LIBRARY_KEYS = exports2.MODEL_LIBRARIES_UI_ELEMENTS = void 0;
    var snippets = __importStar(require_model_libraries_snippets());
    exports2.MODEL_LIBRARIES_UI_ELEMENTS = {
      acestep: {
        prettyLabel: "ACE-Step",
        repoName: "ACE-Step",
        repoUrl: "https://github.com/ace-step/ACE-Step",
        filter: false,
        countDownloads: `path:"ace_step_transformer/config.json"`
      },
      "adapter-transformers": {
        prettyLabel: "Adapters",
        repoName: "adapters",
        repoUrl: "https://github.com/Adapter-Hub/adapters",
        docsUrl: "https://huggingface.co/docs/hub/adapters",
        snippets: snippets.adapters,
        filter: true,
        countDownloads: `path:"adapter_config.json"`
      },
      allennlp: {
        prettyLabel: "AllenNLP",
        repoName: "AllenNLP",
        repoUrl: "https://github.com/allenai/allennlp",
        docsUrl: "https://huggingface.co/docs/hub/allennlp",
        snippets: snippets.allennlp,
        filter: true
      },
      anemoi: {
        prettyLabel: "AnemoI",
        repoName: "AnemoI",
        repoUrl: "https://github.com/ecmwf/anemoi-inference",
        docsUrl: "https://anemoi.readthedocs.io/en/latest/",
        filter: false,
        countDownloads: `path_extension:"ckpt"`,
        snippets: snippets.anemoi
      },
      araclip: {
        prettyLabel: "AraClip",
        repoName: "AraClip",
        repoUrl: "https://huggingface.co/Arabic-Clip/araclip",
        filter: false,
        snippets: snippets.araclip
      },
      asteroid: {
        prettyLabel: "Asteroid",
        repoName: "Asteroid",
        repoUrl: "https://github.com/asteroid-team/asteroid",
        docsUrl: "https://huggingface.co/docs/hub/asteroid",
        snippets: snippets.asteroid,
        filter: true,
        countDownloads: `path:"pytorch_model.bin"`
      },
      audiocraft: {
        prettyLabel: "Audiocraft",
        repoName: "audiocraft",
        repoUrl: "https://github.com/facebookresearch/audiocraft",
        snippets: snippets.audiocraft,
        filter: false,
        countDownloads: `path:"state_dict.bin"`
      },
      audioseal: {
        prettyLabel: "AudioSeal",
        repoName: "audioseal",
        repoUrl: "https://github.com/facebookresearch/audioseal",
        filter: false,
        countDownloads: `path_extension:"pth"`,
        snippets: snippets.audioseal
      },
      "bagel-mot": {
        prettyLabel: "Bagel",
        repoName: "Bagel",
        repoUrl: "https://github.com/ByteDance-Seed/Bagel/",
        filter: false,
        countDownloads: `path:"llm_config.json"`
      },
      bboxmaskpose: {
        prettyLabel: "BBoxMaskPose",
        repoName: "BBoxMaskPose",
        repoUrl: "https://github.com/MiraPurkrabek/BBoxMaskPose",
        filter: false,
        countDownloads: `path_extension:"pth"`
      },
      ben2: {
        prettyLabel: "BEN2",
        repoName: "BEN2",
        repoUrl: "https://github.com/PramaLLC/BEN2",
        snippets: snippets.ben2,
        filter: false
      },
      bertopic: {
        prettyLabel: "BERTopic",
        repoName: "BERTopic",
        repoUrl: "https://github.com/MaartenGr/BERTopic",
        snippets: snippets.bertopic,
        filter: true
      },
      big_vision: {
        prettyLabel: "Big Vision",
        repoName: "big_vision",
        repoUrl: "https://github.com/google-research/big_vision",
        filter: false,
        countDownloads: `path_extension:"npz"`
      },
      birder: {
        prettyLabel: "Birder",
        repoName: "Birder",
        repoUrl: "https://gitlab.com/birder/birder",
        filter: false,
        countDownloads: `path_extension:"pt"`
      },
      birefnet: {
        prettyLabel: "BiRefNet",
        repoName: "BiRefNet",
        repoUrl: "https://github.com/ZhengPeng7/BiRefNet",
        snippets: snippets.birefnet,
        filter: false
      },
      bm25s: {
        prettyLabel: "BM25S",
        repoName: "bm25s",
        repoUrl: "https://github.com/xhluca/bm25s",
        snippets: snippets.bm25s,
        filter: false,
        countDownloads: `path:"params.index.json"`
      },
      boltzgen: {
        prettyLabel: "BoltzGen",
        repoName: "BoltzGen",
        repoUrl: "https://github.com/HannesStark/boltzgen",
        filter: false,
        countDownloads: `path:"boltzgen1_diverse.ckpt"`
      },
      cancertathomev2: {
        prettyLabel: "Cancer@HomeV2",
        repoName: "Cancer@HomeV2",
        repoUrl: "https://huggingface.co/OpenPeerAI/CancerAtHomeV2",
        filter: false,
        countDownloads: `path:"run.py"`
      },
      cartesia_pytorch: {
        prettyLabel: "Cartesia Pytorch",
        repoName: "Cartesia Pytorch",
        repoUrl: "https://github.com/cartesia-ai/cartesia_pytorch",
        snippets: snippets.cartesia_pytorch
      },
      cartesia_mlx: {
        prettyLabel: "Cartesia MLX",
        repoName: "Cartesia MLX",
        repoUrl: "https://github.com/cartesia-ai/cartesia_mlx",
        snippets: snippets.cartesia_mlx
      },
      champ: {
        prettyLabel: "Champ",
        repoName: "Champ",
        repoUrl: "https://github.com/fudan-generative-vision/champ",
        countDownloads: `path:"champ/motion_module.pth"`
      },
      chatterbox: {
        prettyLabel: "Chatterbox",
        repoName: "Chatterbox",
        repoUrl: "https://github.com/resemble-ai/chatterbox",
        snippets: snippets.chatterbox,
        countDownloads: `path:"tokenizer.json"`,
        filter: false
      },
      chaossim: {
        prettyLabel: "ChaosSIM",
        repoName: "ChaosSIM",
        repoUrl: "https://huggingface.co/OpenPeerAI/ChaosSIM/",
        countDownloads: `path:"ChaosSim.nb"`,
        filter: false
      },
      chat_tts: {
        prettyLabel: "ChatTTS",
        repoName: "ChatTTS",
        repoUrl: "https://github.com/2noise/ChatTTS.git",
        snippets: snippets.chattts,
        filter: false,
        countDownloads: `path:"asset/GPT.pt"`
      },
      "chronos-forecasting": {
        prettyLabel: "Chronos",
        repoName: "Chronos",
        repoUrl: "https://github.com/amazon-science/chronos-forecasting",
        snippets: snippets.chronos_forecasting
      },
      clara: {
        prettyLabel: "Clara",
        repoName: "Clara",
        filter: false,
        repoUrl: "https://github.com/nvidia/clara",
        countDownloads: `path_extension:"ckpt" OR path:"config.json"`
      },
      clipscope: {
        prettyLabel: "clipscope",
        repoName: "clipscope",
        repoUrl: "https://github.com/Lewington-pitsos/clipscope",
        filter: false,
        countDownloads: `path_extension:"pt"`
      },
      "cloud-agents": {
        prettyLabel: "Cloud Agents",
        repoName: "Cloud Agents",
        repoUrl: "https://huggingface.co/OpenPeerAI/Cloud-Agents",
        filter: false,
        countDownloads: `path:"setup.py"`
      },
      cosyvoice: {
        prettyLabel: "CosyVoice",
        repoName: "CosyVoice",
        repoUrl: "https://github.com/FunAudioLLM/CosyVoice",
        filter: false,
        countDownloads: `path_extension:"onnx" OR path_extension:"pt"`
      },
      cotracker: {
        prettyLabel: "CoTracker",
        repoName: "CoTracker",
        repoUrl: "https://github.com/facebookresearch/co-tracker",
        filter: false,
        countDownloads: `path_extension:"pth"`
      },
      colpali: {
        prettyLabel: "ColPali",
        repoName: "ColPali",
        repoUrl: "https://github.com/ManuelFay/colpali",
        filter: false,
        countDownloads: `path:"adapter_config.json"`
      },
      comet: {
        prettyLabel: "COMET",
        repoName: "COMET",
        repoUrl: "https://github.com/Unbabel/COMET/",
        countDownloads: `path:"hparams.yaml"`
      },
      cosmos: {
        prettyLabel: "Cosmos",
        repoName: "Cosmos",
        repoUrl: "https://github.com/NVIDIA/Cosmos",
        countDownloads: `path:"config.json" OR path_extension:"pt"`
      },
      "cxr-foundation": {
        prettyLabel: "CXR Foundation",
        repoName: "cxr-foundation",
        repoUrl: "https://github.com/google-health/cxr-foundation",
        snippets: snippets.cxr_foundation,
        filter: false,
        countDownloads: `path:"precomputed_embeddings/embeddings.npz" OR path:"pax-elixr-b-text/saved_model.pb"`
      },
      deepforest: {
        prettyLabel: "DeepForest",
        repoName: "deepforest",
        docsUrl: "https://deepforest.readthedocs.io/en/latest/",
        repoUrl: "https://github.com/weecology/DeepForest"
      },
      "depth-anything-v2": {
        prettyLabel: "DepthAnythingV2",
        repoName: "Depth Anything V2",
        repoUrl: "https://github.com/DepthAnything/Depth-Anything-V2",
        snippets: snippets.depth_anything_v2,
        filter: false,
        countDownloads: `path_extension:"pth"`
      },
      "depth-pro": {
        prettyLabel: "Depth Pro",
        repoName: "Depth Pro",
        repoUrl: "https://github.com/apple/ml-depth-pro",
        countDownloads: `path_extension:"pt"`,
        snippets: snippets.depth_pro,
        filter: false
      },
      "derm-foundation": {
        prettyLabel: "Derm Foundation",
        repoName: "derm-foundation",
        repoUrl: "https://github.com/google-health/derm-foundation",
        snippets: snippets.derm_foundation,
        filter: false,
        countDownloads: `path:"scin_dataset_precomputed_embeddings.npz" OR path:"saved_model.pb"`
      },
      "describe-anything": {
        prettyLabel: "Describe Anything",
        repoName: "Describe Anything",
        repoUrl: "https://github.com/NVlabs/describe-anything",
        snippets: snippets.describe_anything,
        filter: false
      },
      "dia-tts": {
        prettyLabel: "Dia",
        repoName: "Dia",
        repoUrl: "https://github.com/nari-labs/dia",
        snippets: snippets.dia,
        filter: false
      },
      dia2: {
        prettyLabel: "Dia2",
        repoName: "Dia2",
        repoUrl: "https://github.com/nari-labs/dia2",
        snippets: snippets.dia2,
        filter: false
      },
      "diff-interpretation-tuning": {
        prettyLabel: "Diff Interpretation Tuning",
        repoName: "Diff Interpretation Tuning",
        repoUrl: "https://github.com/Aviously/diff-interpretation-tuning",
        filter: false,
        countDownloads: `path_extension:"pt"`
      },
      diffree: {
        prettyLabel: "Diffree",
        repoName: "Diffree",
        repoUrl: "https://github.com/OpenGVLab/Diffree",
        filter: false,
        countDownloads: `path:"diffree-step=000010999.ckpt"`
      },
      diffusers: {
        prettyLabel: "Diffusers",
        repoName: "\u{1F917}/diffusers",
        repoUrl: "https://github.com/huggingface/diffusers",
        docsUrl: "https://huggingface.co/docs/hub/diffusers",
        snippets: snippets.diffusers,
        filter: true
        /// diffusers has its own more complex "countDownloads" query
      },
      diffusionkit: {
        prettyLabel: "DiffusionKit",
        repoName: "DiffusionKit",
        repoUrl: "https://github.com/argmaxinc/DiffusionKit",
        snippets: snippets.diffusionkit
      },
      "docking-at-home": {
        prettyLabel: "Docking@Home",
        repoName: "Docking@Home",
        repoUrl: "https://huggingface.co/OpenPeerAI/DockingAtHOME",
        filter: false,
        countDownloads: `path:"setup.py"`
      },
      doctr: {
        prettyLabel: "docTR",
        repoName: "doctr",
        repoUrl: "https://github.com/mindee/doctr"
      },
      edsnlp: {
        prettyLabel: "EDS-NLP",
        repoName: "edsnlp",
        repoUrl: "https://github.com/aphp/edsnlp",
        docsUrl: "https://aphp.github.io/edsnlp/latest/",
        filter: false,
        snippets: snippets.edsnlp,
        countDownloads: `path_filename:"config" AND path_extension:"cfg"`
      },
      elm: {
        prettyLabel: "ELM",
        repoName: "elm",
        repoUrl: "https://github.com/slicex-ai/elm",
        filter: false,
        countDownloads: `path_filename:"slicex_elm_config" AND path_extension:"json"`
      },
      espnet: {
        prettyLabel: "ESPnet",
        repoName: "ESPnet",
        repoUrl: "https://github.com/espnet/espnet",
        docsUrl: "https://huggingface.co/docs/hub/espnet",
        snippets: snippets.espnet,
        filter: true
      },
      fairseq: {
        prettyLabel: "Fairseq",
        repoName: "fairseq",
        repoUrl: "https://github.com/pytorch/fairseq",
        snippets: snippets.fairseq,
        filter: true
      },
      fastai: {
        prettyLabel: "fastai",
        repoName: "fastai",
        repoUrl: "https://github.com/fastai/fastai",
        docsUrl: "https://huggingface.co/docs/hub/fastai",
        snippets: snippets.fastai,
        filter: true
      },
      fastprint: {
        prettyLabel: "Fast Print",
        repoName: "Fast Print",
        repoUrl: "https://huggingface.co/OpenPeerAI/FastPrint",
        countDownloads: `path_extension:"cs"`
      },
      fasttext: {
        prettyLabel: "fastText",
        repoName: "fastText",
        repoUrl: "https://fasttext.cc/",
        snippets: snippets.fasttext,
        filter: true,
        countDownloads: `path_extension:"bin"`
      },
      fixer: {
        prettyLabel: "Fixer",
        repoName: "Fixer",
        repoUrl: "https://github.com/nv-tlabs/Fixer",
        filter: false,
        countDownloads: `path:"pretrained/pretrained_fixer.pkl"`
      },
      flair: {
        prettyLabel: "Flair",
        repoName: "Flair",
        repoUrl: "https://github.com/flairNLP/flair",
        docsUrl: "https://huggingface.co/docs/hub/flair",
        snippets: snippets.flair,
        filter: true,
        countDownloads: `path:"pytorch_model.bin"`
      },
      fme: {
        prettyLabel: "Full Model Emulation",
        repoName: "Full Model Emulation",
        repoUrl: "https://github.com/ai2cm/ace",
        docsUrl: "https://ai2-climate-emulator.readthedocs.io/en/latest/",
        filter: false,
        countDownloads: `path_extension:"tar"`
      },
      "gemma.cpp": {
        prettyLabel: "gemma.cpp",
        repoName: "gemma.cpp",
        repoUrl: "https://github.com/google/gemma.cpp",
        filter: false,
        countDownloads: `path_extension:"sbs"`
      },
      "geometry-crafter": {
        prettyLabel: "GeometryCrafter",
        repoName: "GeometryCrafter",
        repoUrl: "https://github.com/TencentARC/GeometryCrafter",
        countDownloads: `path:"point_map_vae/diffusion_pytorch_model.safetensors"`
      },
      gliner: {
        prettyLabel: "GLiNER",
        repoName: "GLiNER",
        repoUrl: "https://github.com/urchade/GLiNER",
        snippets: snippets.gliner,
        filter: false,
        countDownloads: `path:"gliner_config.json"`
      },
      gliner2: {
        prettyLabel: "GLiNER2",
        repoName: "GLiNER2",
        repoUrl: "https://github.com/fastino-ai/GLiNER2",
        snippets: snippets.gliner2,
        filter: false
      },
      "glyph-byt5": {
        prettyLabel: "Glyph-ByT5",
        repoName: "Glyph-ByT5",
        repoUrl: "https://github.com/AIGText/Glyph-ByT5",
        filter: false,
        countDownloads: `path:"checkpoints/byt5_model.pt"`
      },
      grok: {
        prettyLabel: "Grok",
        repoName: "Grok",
        repoUrl: "https://github.com/xai-org/grok-1",
        filter: false,
        countDownloads: `path:"ckpt/tensor00000_000" OR path:"ckpt-0/tensor00000_000"`
      },
      hallo: {
        prettyLabel: "Hallo",
        repoName: "Hallo",
        repoUrl: "https://github.com/fudan-generative-vision/hallo",
        countDownloads: `path:"hallo/net.pth"`
      },
      hermes: {
        prettyLabel: "HERMES",
        repoName: "HERMES",
        repoUrl: "https://github.com/LMD0311/HERMES",
        filter: false,
        countDownloads: `path:"ckpt/hermes_final.pth"`
      },
      hezar: {
        prettyLabel: "Hezar",
        repoName: "Hezar",
        repoUrl: "https://github.com/hezarai/hezar",
        docsUrl: "https://hezarai.github.io/hezar",
        countDownloads: `path:"model_config.yaml" OR path:"embedding/embedding_config.yaml"`
      },
      htrflow: {
        prettyLabel: "HTRflow",
        repoName: "HTRflow",
        repoUrl: "https://github.com/AI-Riksarkivet/htrflow",
        docsUrl: "https://ai-riksarkivet.github.io/htrflow",
        snippets: snippets.htrflow
      },
      "hunyuan-dit": {
        prettyLabel: "HunyuanDiT",
        repoName: "HunyuanDiT",
        repoUrl: "https://github.com/Tencent/HunyuanDiT",
        countDownloads: `path:"pytorch_model_ema.pt" OR path:"pytorch_model_distill.pt"`
      },
      "hunyuan3d-2": {
        prettyLabel: "Hunyuan3D-2",
        repoName: "Hunyuan3D-2",
        repoUrl: "https://github.com/Tencent/Hunyuan3D-2",
        countDownloads: `path_filename:"model_index" OR path_filename:"config"`
      },
      "hunyuanworld-voyager": {
        prettyLabel: "HunyuanWorld-voyager",
        repoName: "HunyuanWorld-voyager",
        repoUrl: "https://github.com/Tencent-Hunyuan/HunyuanWorld-Voyager"
      },
      "image-matching-models": {
        prettyLabel: "Image Matching Models",
        repoName: "Image Matching Models",
        repoUrl: "https://github.com/alexstoken/image-matching-models",
        filter: false,
        countDownloads: `path_extension:"safetensors"`
      },
      imstoucan: {
        prettyLabel: "IMS Toucan",
        repoName: "IMS-Toucan",
        repoUrl: "https://github.com/DigitalPhonetics/IMS-Toucan",
        countDownloads: `path:"embedding_gan.pt" OR path:"Vocoder.pt" OR path:"ToucanTTS.pt"`
      },
      "index-tts": {
        prettyLabel: "IndexTTS",
        repoName: "IndexTTS",
        repoUrl: "https://github.com/index-tts/index-tts",
        snippets: snippets.indextts,
        filter: false
      },
      infinitetalk: {
        prettyLabel: "InfiniteTalk",
        repoName: "InfiniteTalk",
        repoUrl: "https://github.com/MeiGen-AI/InfiniteTalk",
        filter: false,
        countDownloads: `path_extension:"safetensors"`
      },
      "infinite-you": {
        prettyLabel: "InfiniteYou",
        repoName: "InfiniteYou",
        repoUrl: "https://github.com/bytedance/InfiniteYou",
        filter: false,
        countDownloads: `path:"infu_flux_v1.0/sim_stage1/image_proj_model.bin" OR path:"infu_flux_v1.0/aes_stage2/image_proj_model.bin"`
      },
      keras: {
        prettyLabel: "Keras",
        repoName: "Keras",
        repoUrl: "https://github.com/keras-team/keras",
        docsUrl: "https://huggingface.co/docs/hub/keras",
        snippets: snippets.keras,
        filter: true,
        countDownloads: `path:"config.json" OR path_extension:"keras"`
      },
      "tf-keras": {
        // Legacy "Keras 2" library (tensorflow-only)
        prettyLabel: "TF-Keras",
        repoName: "TF-Keras",
        repoUrl: "https://github.com/keras-team/tf-keras",
        docsUrl: "https://huggingface.co/docs/hub/tf-keras",
        snippets: snippets.tf_keras,
        countDownloads: `path:"saved_model.pb"`
      },
      "keras-hub": {
        prettyLabel: "KerasHub",
        repoName: "KerasHub",
        repoUrl: "https://github.com/keras-team/keras-hub",
        docsUrl: "https://keras.io/keras_hub/",
        snippets: snippets.keras_hub,
        filter: true
      },
      kernels: {
        prettyLabel: "Kernels",
        repoName: "Kernels",
        repoUrl: "https://github.com/huggingface/kernels",
        docsUrl: "https://huggingface.co/docs/kernels",
        snippets: snippets.kernels,
        countDownloads: `path_filename:"_ops" AND path_extension:"py"`
      },
      "kimi-audio": {
        prettyLabel: "KimiAudio",
        repoName: "KimiAudio",
        repoUrl: "https://github.com/MoonshotAI/Kimi-Audio",
        snippets: snippets.kimi_audio,
        filter: false
      },
      kittentts: {
        prettyLabel: "KittenTTS",
        repoName: "KittenTTS",
        repoUrl: "https://github.com/KittenML/KittenTTS",
        snippets: snippets.kittentts
      },
      kronos: {
        prettyLabel: "KRONOS",
        repoName: "KRONOS",
        repoUrl: "https://github.com/mahmoodlab/KRONOS",
        filter: false,
        countDownloads: `path_extension:"pt"`
      },
      k2: {
        prettyLabel: "K2",
        repoName: "k2",
        repoUrl: "https://github.com/k2-fsa/k2"
      },
      "lightning-ir": {
        prettyLabel: "Lightning IR",
        repoName: "Lightning IR",
        repoUrl: "https://github.com/webis-de/lightning-ir",
        snippets: snippets.lightning_ir
      },
      litert: {
        prettyLabel: "LiteRT",
        repoName: "LiteRT",
        repoUrl: "https://github.com/google-ai-edge/LiteRT",
        filter: false,
        countDownloads: `path_extension:"tflite"`
      },
      "litert-lm": {
        prettyLabel: "LiteRT-LM",
        repoName: "LiteRT-LM",
        repoUrl: "https://github.com/google-ai-edge/LiteRT-LM",
        filter: false,
        countDownloads: `path_extension:"litertlm" OR path_extension:"task"`
      },
      lerobot: {
        prettyLabel: "LeRobot",
        repoName: "LeRobot",
        repoUrl: "https://github.com/huggingface/lerobot",
        docsUrl: "https://huggingface.co/docs/lerobot",
        filter: false,
        snippets: snippets.lerobot
      },
      lightglue: {
        prettyLabel: "LightGlue",
        repoName: "LightGlue",
        repoUrl: "https://github.com/cvg/LightGlue",
        filter: false,
        countDownloads: `path_extension:"pth" OR path:"config.json"`
      },
      liveportrait: {
        prettyLabel: "LivePortrait",
        repoName: "LivePortrait",
        repoUrl: "https://github.com/KwaiVGI/LivePortrait",
        filter: false,
        countDownloads: `path:"liveportrait/landmark.onnx"`
      },
      "llama-cpp-python": {
        prettyLabel: "llama-cpp-python",
        repoName: "llama-cpp-python",
        repoUrl: "https://github.com/abetlen/llama-cpp-python",
        snippets: snippets.llama_cpp_python
      },
      "mini-omni2": {
        prettyLabel: "Mini-Omni2",
        repoName: "Mini-Omni2",
        repoUrl: "https://github.com/gpt-omni/mini-omni2",
        countDownloads: `path:"model_config.yaml"`
      },
      mindspore: {
        prettyLabel: "MindSpore",
        repoName: "mindspore",
        repoUrl: "https://github.com/mindspore-ai/mindspore"
      },
      "magi-1": {
        prettyLabel: "MAGI-1",
        repoName: "MAGI-1",
        repoUrl: "https://github.com/SandAI-org/MAGI-1",
        countDownloads: `path:"ckpt/vae/config.json"`
      },
      "magenta-realtime": {
        prettyLabel: "Magenta RT",
        repoName: "Magenta RT",
        repoUrl: "https://github.com/magenta/magenta-realtime",
        countDownloads: `path:"checkpoints/llm_base_x4286_c1860k.tar" OR path:"checkpoints/llm_large_x3047_c1860k.tar" OR path:"checkpoints/llm_large_x3047_c1860k/checkpoint"`
      },
      "mamba-ssm": {
        prettyLabel: "MambaSSM",
        repoName: "MambaSSM",
        repoUrl: "https://github.com/state-spaces/mamba",
        filter: false,
        snippets: snippets.mamba_ssm
      },
      "mars5-tts": {
        prettyLabel: "MARS5-TTS",
        repoName: "MARS5-TTS",
        repoUrl: "https://github.com/Camb-ai/MARS5-TTS",
        filter: false,
        countDownloads: `path:"mars5_ar.safetensors"`,
        snippets: snippets.mars5_tts
      },
      matanyone: {
        prettyLabel: "MatAnyone",
        repoName: "MatAnyone",
        repoUrl: "https://github.com/pq-yang/MatAnyone",
        snippets: snippets.matanyone,
        filter: false
      },
      "mesh-anything": {
        prettyLabel: "MeshAnything",
        repoName: "MeshAnything",
        repoUrl: "https://github.com/buaacyw/MeshAnything",
        filter: false,
        countDownloads: `path:"MeshAnything_350m.pth"`,
        snippets: snippets.mesh_anything
      },
      merlin: {
        prettyLabel: "Merlin",
        repoName: "Merlin",
        repoUrl: "https://github.com/StanfordMIMI/Merlin",
        filter: false,
        countDownloads: `path_extension:"pt"`
      },
      medvae: {
        prettyLabel: "MedVAE",
        repoName: "MedVAE",
        repoUrl: "https://github.com/StanfordMIMI/MedVAE",
        filter: false,
        countDownloads: `path_extension:"ckpt"`
      },
      mitie: {
        prettyLabel: "MITIE",
        repoName: "MITIE",
        repoUrl: "https://github.com/mit-nlp/MITIE",
        countDownloads: `path_filename:"total_word_feature_extractor"`
      },
      "ml-agents": {
        prettyLabel: "ml-agents",
        repoName: "ml-agents",
        repoUrl: "https://github.com/Unity-Technologies/ml-agents",
        docsUrl: "https://huggingface.co/docs/hub/ml-agents",
        snippets: snippets.mlAgents,
        filter: true,
        countDownloads: `path_extension:"onnx"`
      },
      mlx: {
        prettyLabel: "MLX",
        repoName: "MLX",
        repoUrl: "https://github.com/ml-explore/mlx-examples/tree/main",
        snippets: snippets.mlx,
        filter: true
      },
      "mlx-image": {
        prettyLabel: "mlx-image",
        repoName: "mlx-image",
        repoUrl: "https://github.com/riccardomusmeci/mlx-image",
        docsUrl: "https://huggingface.co/docs/hub/mlx-image",
        snippets: snippets.mlxim,
        filter: false,
        countDownloads: `path:"model.safetensors"`
      },
      "mlc-llm": {
        prettyLabel: "MLC-LLM",
        repoName: "MLC-LLM",
        repoUrl: "https://github.com/mlc-ai/mlc-llm",
        docsUrl: "https://llm.mlc.ai/docs/",
        filter: false,
        countDownloads: `path:"mlc-chat-config.json"`
      },
      model2vec: {
        prettyLabel: "Model2Vec",
        repoName: "model2vec",
        repoUrl: "https://github.com/MinishLab/model2vec",
        snippets: snippets.model2vec,
        filter: false
      },
      moshi: {
        prettyLabel: "Moshi",
        repoName: "Moshi",
        repoUrl: "https://github.com/kyutai-labs/moshi",
        filter: false,
        countDownloads: `path:"tokenizer-e351c8d8-checkpoint125.safetensors"`
      },
      mtvcraft: {
        prettyLabel: "MTVCraft",
        repoName: "MTVCraft",
        repoUrl: "https://github.com/baaivision/MTVCraft",
        filter: false,
        countDownloads: `path:"vae/3d-vae.pt"`
      },
      nemo: {
        prettyLabel: "NeMo",
        repoName: "NeMo",
        repoUrl: "https://github.com/NVIDIA/NeMo",
        snippets: snippets.nemo,
        filter: true,
        countDownloads: `path_extension:"nemo" OR path:"model_config.yaml" OR path_extension:"json"`
      },
      "open-oasis": {
        prettyLabel: "open-oasis",
        repoName: "open-oasis",
        repoUrl: "https://github.com/etched-ai/open-oasis",
        countDownloads: `path:"oasis500m.safetensors"`
      },
      open_clip: {
        prettyLabel: "OpenCLIP",
        repoName: "OpenCLIP",
        repoUrl: "https://github.com/mlfoundations/open_clip",
        snippets: snippets.open_clip,
        filter: true,
        countDownloads: `path:"open_clip_model.safetensors"
			OR path:"model.safetensors"
			OR path:"open_clip_pytorch_model.bin"
			OR path:"pytorch_model.bin"`
      },
      openpeerllm: {
        prettyLabel: "OpenPeerLLM",
        repoName: "OpenPeerLLM",
        repoUrl: "https://huggingface.co/openpeerai/openpeerllm",
        docsUrl: "https://huggingface.co/OpenPeerAI/OpenPeerLLM/blob/main/README.md",
        countDownloads: `path:".meta-huggingface.json"`,
        filter: false
      },
      "open-sora": {
        prettyLabel: "Open-Sora",
        repoName: "Open-Sora",
        repoUrl: "https://github.com/hpcaitech/Open-Sora",
        filter: false,
        countDownloads: `path:"Open_Sora_v2.safetensors"`
      },
      outetts: {
        prettyLabel: "OuteTTS",
        repoName: "OuteTTS",
        repoUrl: "https://github.com/edwko/OuteTTS",
        snippets: snippets.outetts,
        filter: false
      },
      paddlenlp: {
        prettyLabel: "paddlenlp",
        repoName: "PaddleNLP",
        repoUrl: "https://github.com/PaddlePaddle/PaddleNLP",
        docsUrl: "https://huggingface.co/docs/hub/paddlenlp",
        snippets: snippets.paddlenlp,
        filter: true,
        countDownloads: `path:"model_config.json"`
      },
      PaddleOCR: {
        prettyLabel: "PaddleOCR",
        repoName: "PaddleOCR",
        repoUrl: "https://github.com/PaddlePaddle/PaddleOCR",
        docsUrl: "https://www.paddleocr.ai/",
        snippets: snippets.paddleocr,
        filter: true,
        countDownloads: `path_extension:"safetensors" OR path:"inference.pdiparams"`
      },
      peft: {
        prettyLabel: "PEFT",
        repoName: "PEFT",
        repoUrl: "https://github.com/huggingface/peft",
        snippets: snippets.peft,
        filter: true,
        countDownloads: `path:"adapter_config.json"`
      },
      "perception-encoder": {
        prettyLabel: "PerceptionEncoder",
        repoName: "PerceptionModels",
        repoUrl: "https://github.com/facebookresearch/perception_models",
        filter: false,
        snippets: snippets.perception_encoder,
        countDownloads: `path_extension:"pt"`
      },
      "phantom-wan": {
        prettyLabel: "Phantom",
        repoName: "Phantom",
        repoUrl: "https://github.com/Phantom-video/Phantom",
        snippets: snippets.phantom_wan,
        filter: false,
        countDownloads: `path_extension:"pth"`
      },
      "pruna-ai": {
        prettyLabel: "Pruna AI",
        repoName: "Pruna AI",
        repoUrl: "https://github.com/PrunaAI/pruna",
        snippets: snippets.pruna,
        docsUrl: "https://docs.pruna.ai"
      },
      pxia: {
        prettyLabel: "pxia",
        repoName: "pxia",
        repoUrl: "https://github.com/not-lain/pxia",
        snippets: snippets.pxia,
        filter: false
      },
      "pyannote-audio": {
        prettyLabel: "pyannote.audio",
        repoName: "pyannote-audio",
        repoUrl: "https://github.com/pyannote/pyannote-audio",
        snippets: snippets.pyannote_audio,
        filter: true
      },
      "py-feat": {
        prettyLabel: "Py-Feat",
        repoName: "Py-Feat",
        repoUrl: "https://github.com/cosanlab/py-feat",
        docsUrl: "https://py-feat.org/",
        filter: false
      },
      pythae: {
        prettyLabel: "pythae",
        repoName: "pythae",
        repoUrl: "https://github.com/clementchadebec/benchmark_VAE",
        snippets: snippets.pythae,
        filter: false
      },
      quantumpeer: {
        prettyLabel: "QuantumPeer",
        repoName: "QuantumPeer",
        repoUrl: "https://github.com/OpenPeer-AI/QuantumPeer",
        filter: false,
        countDownloads: `path_extension:"setup.py"`
      },
      recurrentgemma: {
        prettyLabel: "RecurrentGemma",
        repoName: "recurrentgemma",
        repoUrl: "https://github.com/google-deepmind/recurrentgemma",
        filter: false,
        countDownloads: `path:"tokenizer.model"`
      },
      relik: {
        prettyLabel: "Relik",
        repoName: "Relik",
        repoUrl: "https://github.com/SapienzaNLP/relik",
        snippets: snippets.relik,
        filter: false
      },
      refiners: {
        prettyLabel: "Refiners",
        repoName: "Refiners",
        repoUrl: "https://github.com/finegrain-ai/refiners",
        docsUrl: "https://refine.rs/",
        filter: false,
        countDownloads: `path:"model.safetensors"`
      },
      renderformer: {
        prettyLabel: "RenderFormer",
        repoName: "RenderFormer",
        repoUrl: "https://github.com/microsoft/renderformer",
        snippets: snippets.renderformer,
        filter: false
      },
      reverb: {
        prettyLabel: "Reverb",
        repoName: "Reverb",
        repoUrl: "https://github.com/revdotcom/reverb",
        filter: false
      },
      rkllm: {
        prettyLabel: "RKLLM",
        repoName: "RKLLM",
        repoUrl: "https://github.com/airockchip/rknn-llm",
        countDownloads: `path_extension:"rkllm"`
      },
      saelens: {
        prettyLabel: "SAELens",
        repoName: "SAELens",
        repoUrl: "https://github.com/jbloomAus/SAELens",
        snippets: snippets.saelens,
        filter: false
      },
      sam2: {
        prettyLabel: "sam2",
        repoName: "sam2",
        repoUrl: "https://github.com/facebookresearch/segment-anything-2",
        filter: false,
        snippets: snippets.sam2,
        countDownloads: `path_extension:"pt"`
      },
      "sam-3d-body": {
        prettyLabel: "SAM 3D Body",
        repoName: "SAM 3D Body",
        repoUrl: "https://github.com/facebookresearch/sam-3d-body",
        filter: false,
        snippets: snippets.sam_3d_body,
        countDownloads: `path:"model_config.yaml"`
      },
      "sam-3d-objects": {
        prettyLabel: "SAM 3D Objects",
        repoName: "SAM 3D Objects",
        repoUrl: "https://github.com/facebookresearch/sam-3d-objects",
        filter: false,
        snippets: snippets.sam_3d_objects,
        countDownloads: `path:"checkpoints/pipeline.yaml"`
      },
      "sample-factory": {
        prettyLabel: "sample-factory",
        repoName: "sample-factory",
        repoUrl: "https://github.com/alex-petrenko/sample-factory",
        docsUrl: "https://huggingface.co/docs/hub/sample-factory",
        snippets: snippets.sampleFactory,
        filter: true,
        countDownloads: `path:"cfg.json"`
      },
      "sap-rpt-1-oss": {
        prettyLabel: "sap-rpt-1-oss",
        repoName: "sap-rpt-1-oss",
        repoUrl: "https://github.com/SAP-samples/sap-rpt-1-oss",
        countDownloads: `path_extension:"pt"`,
        snippets: snippets.sap_rpt_one_oss
      },
      sapiens: {
        prettyLabel: "sapiens",
        repoName: "sapiens",
        repoUrl: "https://github.com/facebookresearch/sapiens",
        filter: false,
        countDownloads: `path_extension:"pt2" OR path_extension:"pth" OR path_extension:"onnx"`
      },
      seedvr: {
        prettyLabel: "SeedVR",
        repoName: "SeedVR",
        repoUrl: "https://github.com/ByteDance-Seed/SeedVR",
        filter: false,
        countDownloads: `path_extension:"pth"`
      },
      "self-forcing": {
        prettyLabel: "SelfForcing",
        repoName: "SelfForcing",
        repoUrl: "https://github.com/guandeh17/Self-Forcing",
        filter: false,
        countDownloads: `path_extension:"pt"`
      },
      "sentence-transformers": {
        prettyLabel: "sentence-transformers",
        repoName: "sentence-transformers",
        repoUrl: "https://github.com/UKPLab/sentence-transformers",
        docsUrl: "https://huggingface.co/docs/hub/sentence-transformers",
        snippets: snippets.sentenceTransformers,
        filter: true
      },
      setfit: {
        prettyLabel: "setfit",
        repoName: "setfit",
        repoUrl: "https://github.com/huggingface/setfit",
        docsUrl: "https://huggingface.co/docs/hub/setfit",
        snippets: snippets.setfit,
        filter: true
      },
      sklearn: {
        prettyLabel: "Scikit-learn",
        repoName: "Scikit-learn",
        repoUrl: "https://github.com/scikit-learn/scikit-learn",
        snippets: snippets.sklearn,
        filter: true,
        countDownloads: `path:"sklearn_model.joblib"`
      },
      spacy: {
        prettyLabel: "spaCy",
        repoName: "spaCy",
        repoUrl: "https://github.com/explosion/spaCy",
        docsUrl: "https://huggingface.co/docs/hub/spacy",
        snippets: snippets.spacy,
        filter: true,
        countDownloads: `path_extension:"whl"`
      },
      "span-marker": {
        prettyLabel: "SpanMarker",
        repoName: "SpanMarkerNER",
        repoUrl: "https://github.com/tomaarsen/SpanMarkerNER",
        docsUrl: "https://huggingface.co/docs/hub/span_marker",
        snippets: snippets.span_marker,
        filter: true
      },
      speechbrain: {
        prettyLabel: "speechbrain",
        repoName: "speechbrain",
        repoUrl: "https://github.com/speechbrain/speechbrain",
        docsUrl: "https://huggingface.co/docs/hub/speechbrain",
        snippets: snippets.speechbrain,
        filter: true,
        countDownloads: `path:"hyperparams.yaml"`
      },
      "ssr-speech": {
        prettyLabel: "SSR-Speech",
        repoName: "SSR-Speech",
        repoUrl: "https://github.com/WangHelin1997/SSR-Speech",
        filter: false,
        countDownloads: `path_extension:".pth"`
      },
      "stable-audio-tools": {
        prettyLabel: "Stable Audio Tools",
        repoName: "stable-audio-tools",
        repoUrl: "https://github.com/Stability-AI/stable-audio-tools.git",
        filter: false,
        countDownloads: `path:"model.safetensors"`,
        snippets: snippets.stable_audio_tools
      },
      monkeyocr: {
        prettyLabel: "MonkeyOCR",
        repoName: "monkeyocr",
        repoUrl: "https://github.com/Yuliang-Liu/MonkeyOCR",
        filter: false,
        countDownloads: `path:"Recognition/config.json"`
      },
      "diffusion-single-file": {
        prettyLabel: "Diffusion Single File",
        repoName: "diffusion-single-file",
        repoUrl: "https://github.com/comfyanonymous/ComfyUI",
        filter: false,
        countDownloads: `path_extension:"safetensors"`
      },
      "seed-story": {
        prettyLabel: "SEED-Story",
        repoName: "SEED-Story",
        repoUrl: "https://github.com/TencentARC/SEED-Story",
        filter: false,
        countDownloads: `path:"cvlm_llama2_tokenizer/tokenizer.model"`,
        snippets: snippets.seed_story
      },
      soloaudio: {
        prettyLabel: "SoloAudio",
        repoName: "SoloAudio",
        repoUrl: "https://github.com/WangHelin1997/SoloAudio",
        filter: false,
        countDownloads: `path:"soloaudio_v2.pt"`
      },
      songbloom: {
        prettyLabel: "SongBloom",
        repoName: "SongBloom",
        repoUrl: "https://github.com/Cypress-Yang/SongBloom",
        filter: false,
        countDownloads: `path_extension:"pt"`
      },
      "stable-baselines3": {
        prettyLabel: "stable-baselines3",
        repoName: "stable-baselines3",
        repoUrl: "https://github.com/huggingface/huggingface_sb3",
        docsUrl: "https://huggingface.co/docs/hub/stable-baselines3",
        snippets: snippets.stableBaselines3,
        filter: true,
        countDownloads: `path_extension:"zip"`
      },
      stanza: {
        prettyLabel: "Stanza",
        repoName: "stanza",
        repoUrl: "https://github.com/stanfordnlp/stanza",
        docsUrl: "https://huggingface.co/docs/hub/stanza",
        snippets: snippets.stanza,
        filter: true,
        countDownloads: `path:"models/default.zip"`
      },
      supertonic: {
        prettyLabel: "Supertonic",
        repoName: "Supertonic",
        repoUrl: "https://github.com/supertone-inc/supertonic",
        snippets: snippets.supertonic,
        filter: false
      },
      swarmformer: {
        prettyLabel: "SwarmFormer",
        repoName: "SwarmFormer",
        repoUrl: "https://github.com/takara-ai/SwarmFormer",
        snippets: snippets.swarmformer,
        filter: false
      },
      "f5-tts": {
        prettyLabel: "F5-TTS",
        repoName: "F5-TTS",
        repoUrl: "https://github.com/SWivid/F5-TTS",
        filter: false,
        countDownloads: `path_extension:"safetensors" OR path_extension:"pt"`
      },
      genmo: {
        prettyLabel: "Genmo",
        repoName: "Genmo",
        repoUrl: "https://github.com/genmoai/models",
        filter: false,
        countDownloads: `path:"vae_stats.json"`
      },
      "tencent-song-generation": {
        prettyLabel: "SongGeneration",
        repoName: "SongGeneration",
        repoUrl: "https://github.com/tencent-ailab/songgeneration",
        filter: false,
        countDownloads: `path:"ckpt/songgeneration_base/model.pt"`
      },
      tensorflowtts: {
        prettyLabel: "TensorFlowTTS",
        repoName: "TensorFlowTTS",
        repoUrl: "https://github.com/TensorSpeech/TensorFlowTTS",
        snippets: snippets.tensorflowtts
      },
      tensorrt: {
        prettyLabel: "TensorRT",
        repoName: "TensorRT",
        repoUrl: "https://github.com/NVIDIA/TensorRT",
        countDownloads: `path_extension:"onnx"`
      },
      tabpfn: {
        prettyLabel: "TabPFN",
        repoName: "TabPFN",
        repoUrl: "https://github.com/PriorLabs/TabPFN"
      },
      terratorch: {
        prettyLabel: "TerraTorch",
        repoName: "TerraTorch",
        repoUrl: "https://github.com/IBM/terratorch",
        docsUrl: "https://ibm.github.io/terratorch/",
        filter: false,
        countDownloads: `path_extension:"pt" OR path_extension:"ckpt"`,
        snippets: snippets.terratorch
      },
      "tic-clip": {
        prettyLabel: "TiC-CLIP",
        repoName: "TiC-CLIP",
        repoUrl: "https://github.com/apple/ml-tic-clip",
        filter: false,
        countDownloads: `path_extension:"pt" AND path_prefix:"checkpoints/"`
      },
      timesfm: {
        prettyLabel: "TimesFM",
        repoName: "timesfm",
        repoUrl: "https://github.com/google-research/timesfm",
        filter: false,
        countDownloads: `path:"checkpoints/checkpoint_1100000/state/checkpoint" OR path:"checkpoints/checkpoint_2150000/state/checkpoint" OR path_extension:"ckpt"`
      },
      timm: {
        prettyLabel: "timm",
        repoName: "pytorch-image-models",
        repoUrl: "https://github.com/rwightman/pytorch-image-models",
        docsUrl: "https://huggingface.co/docs/hub/timm",
        snippets: snippets.timm,
        filter: true,
        countDownloads: `path:"pytorch_model.bin" OR path:"model.safetensors"`
      },
      tirex: {
        prettyLabel: "TiRex",
        repoName: "TiRex",
        repoUrl: "https://github.com/NX-AI/tirex",
        countDownloads: `path_extension:"ckpt"`
      },
      torchgeo: {
        prettyLabel: "TorchGeo",
        repoName: "TorchGeo",
        repoUrl: "https://github.com/microsoft/torchgeo",
        docsUrl: "https://torchgeo.readthedocs.io/",
        filter: false,
        countDownloads: `path_extension:"pt" OR path_extension:"pth"`
      },
      transformers: {
        prettyLabel: "Transformers",
        repoName: "\u{1F917}/transformers",
        repoUrl: "https://github.com/huggingface/transformers",
        docsUrl: "https://huggingface.co/docs/hub/transformers",
        snippets: snippets.transformers,
        filter: true
      },
      "transformers.js": {
        prettyLabel: "Transformers.js",
        repoName: "transformers.js",
        repoUrl: "https://github.com/huggingface/transformers.js",
        docsUrl: "https://huggingface.co/docs/hub/transformers-js",
        snippets: snippets.transformersJS,
        filter: true
      },
      trellis: {
        prettyLabel: "Trellis",
        repoName: "Trellis",
        repoUrl: "https://github.com/microsoft/TRELLIS",
        countDownloads: `path_extension:"safetensors"`
      },
      ultralytics: {
        prettyLabel: "ultralytics",
        repoName: "ultralytics",
        repoUrl: "https://github.com/ultralytics/ultralytics",
        docsUrl: "https://github.com/ultralytics/ultralytics",
        filter: false,
        countDownloads: `path_extension:"pt"`,
        snippets: snippets.ultralytics
      },
      univa: {
        prettyLabel: "univa",
        repoName: "univa",
        repoUrl: "https://github.com/PKU-YuanGroup/UniWorld-V1",
        snippets: snippets.univa,
        filter: true,
        countDownloads: `path:"config.json"`
      },
      "uni-3dar": {
        prettyLabel: "Uni-3DAR",
        repoName: "Uni-3DAR",
        repoUrl: "https://github.com/dptech-corp/Uni-3DAR",
        docsUrl: "https://github.com/dptech-corp/Uni-3DAR",
        countDownloads: `path_extension:"pt"`
      },
      "unity-sentis": {
        prettyLabel: "unity-sentis",
        repoName: "unity-sentis",
        repoUrl: "https://github.com/Unity-Technologies/sentis-samples",
        snippets: snippets.sentis,
        filter: true,
        countDownloads: `path_extension:"sentis"`
      },
      sana: {
        prettyLabel: "Sana",
        repoName: "Sana",
        repoUrl: "https://github.com/NVlabs/Sana",
        countDownloads: `path_extension:"pth"`,
        snippets: snippets.sana
      },
      videoprism: {
        prettyLabel: "VideoPrism",
        repoName: "VideoPrism",
        repoUrl: "https://github.com/google-deepmind/videoprism",
        countDownloads: `path_extension:"npz"`,
        snippets: snippets.videoprism
      },
      "vfi-mamba": {
        prettyLabel: "VFIMamba",
        repoName: "VFIMamba",
        repoUrl: "https://github.com/MCG-NJU/VFIMamba",
        countDownloads: `path_extension:"pkl"`,
        snippets: snippets.vfimamba
      },
      lvface: {
        prettyLabel: "LVFace",
        repoName: "LVFace",
        repoUrl: "https://github.com/bytedance/LVFace",
        countDownloads: `path_extension:"pt" OR path_extension:"onnx"`,
        snippets: snippets.lvface
      },
      voicecraft: {
        prettyLabel: "VoiceCraft",
        repoName: "VoiceCraft",
        repoUrl: "https://github.com/jasonppy/VoiceCraft",
        docsUrl: "https://github.com/jasonppy/VoiceCraft",
        snippets: snippets.voicecraft
      },
      voxcpm: {
        prettyLabel: "VoxCPM",
        repoName: "VoxCPM",
        repoUrl: "https://github.com/OpenBMB/VoxCPM",
        snippets: snippets.voxcpm,
        filter: false
      },
      vui: {
        prettyLabel: "Vui",
        repoName: "Vui",
        repoUrl: "https://github.com/vui-ai/vui",
        countDownloads: `path_extension:"pt"`,
        snippets: snippets.vui
      },
      vibevoice: {
        prettyLabel: "VibeVoice",
        repoName: "VibeVoice",
        repoUrl: "https://github.com/microsoft/VibeVoice",
        snippets: snippets.vibevoice,
        filter: false
      },
      videox_fun: {
        prettyLabel: "VideoX Fun",
        repoName: "VideoX Fun",
        repoUrl: "https://github.com/aigc-apps/VideoX-Fun",
        filter: false,
        countDownloads: `path_extension:"safetensors"`
      },
      "wan2.2": {
        prettyLabel: "Wan2.2",
        repoName: "Wan2.2",
        repoUrl: "https://github.com/Wan-Video/Wan2.2",
        countDownloads: `path_filename:"config" AND path_extension:"json"`
      },
      wham: {
        prettyLabel: "WHAM",
        repoName: "wham",
        repoUrl: "https://huggingface.co/microsoft/wham",
        docsUrl: "https://huggingface.co/microsoft/wham/blob/main/README.md",
        countDownloads: `path_extension:"ckpt"`
      },
      whisperkit: {
        prettyLabel: "WhisperKit",
        repoName: "WhisperKit",
        repoUrl: "https://github.com/argmaxinc/WhisperKit",
        docsUrl: "https://github.com/argmaxinc/WhisperKit?tab=readme-ov-file#homebrew",
        snippets: snippets.whisperkit,
        countDownloads: `path_filename:"model" AND path_extension:"mil" AND _exists_:"path_prefix"`
      },
      yolov10: {
        // YOLOv10 is a fork of ultraLytics. Code snippets and download count are the same but the repo is different.
        prettyLabel: "YOLOv10",
        repoName: "YOLOv10",
        repoUrl: "https://github.com/THU-MIG/yolov10",
        docsUrl: "https://github.com/THU-MIG/yolov10",
        countDownloads: `path_extension:"pt" OR path_extension:"safetensors"`,
        snippets: snippets.ultralytics
      },
      zonos: {
        prettyLabel: "Zonos",
        repoName: "Zonos",
        repoUrl: "https://github.com/Zyphra/Zonos",
        docsUrl: "https://github.com/Zyphra/Zonos",
        snippets: snippets.zonos,
        filter: false
      },
      "3dtopia-xl": {
        prettyLabel: "3DTopia-XL",
        repoName: "3DTopia-XL",
        repoUrl: "https://github.com/3DTopia/3DTopia-XL",
        filter: false,
        countDownloads: `path:"model_vae_fp16.pt"`,
        snippets: snippets.threedtopia_xl
      }
    };
    exports2.ALL_MODEL_LIBRARY_KEYS = Object.keys(exports2.MODEL_LIBRARIES_UI_ELEMENTS);
    exports2.ALL_DISPLAY_MODEL_LIBRARY_KEYS = Object.entries(exports2.MODEL_LIBRARIES_UI_ELEMENTS).filter(([_, v]) => v.filter).map(([k]) => k);
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/tokenizer-data.js
var require_tokenizer_data = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/tokenizer-data.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SPECIAL_TOKENS_ATTRIBUTES = void 0;
    exports2.SPECIAL_TOKENS_ATTRIBUTES = [
      "bos_token",
      "eos_token",
      "unk_token",
      "sep_token",
      "pad_token",
      "cls_token",
      "mask_token"
      // additional_special_tokens (TODO)
    ];
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/gguf.js
var require_gguf = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/gguf.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GGMLQuantizationType = exports2.GGUF_QUANT_ORDER = exports2.GGUF_QUANT_RE_GLOBAL = exports2.GGUF_QUANT_RE = exports2.GGMLFileQuantizationType = void 0;
    exports2.parseGGUFQuantLabel = parseGGUFQuantLabel;
    exports2.findNearestQuantType = findNearestQuantType;
    var GGMLFileQuantizationType;
    (function(GGMLFileQuantizationType2) {
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["F32"] = 0] = "F32";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["F16"] = 1] = "F16";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_0"] = 2] = "Q4_0";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_1"] = 3] = "Q4_1";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_1_SOME_F16"] = 4] = "Q4_1_SOME_F16";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_2"] = 5] = "Q4_2";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_3"] = 6] = "Q4_3";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q8_0"] = 7] = "Q8_0";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q5_0"] = 8] = "Q5_0";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q5_1"] = 9] = "Q5_1";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q2_K"] = 10] = "Q2_K";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q3_K_S"] = 11] = "Q3_K_S";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q3_K_M"] = 12] = "Q3_K_M";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q3_K_L"] = 13] = "Q3_K_L";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_K_S"] = 14] = "Q4_K_S";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_K_M"] = 15] = "Q4_K_M";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q5_K_S"] = 16] = "Q5_K_S";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q5_K_M"] = 17] = "Q5_K_M";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q6_K"] = 18] = "Q6_K";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ2_XXS"] = 19] = "IQ2_XXS";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ2_XS"] = 20] = "IQ2_XS";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q2_K_S"] = 21] = "Q2_K_S";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ3_XS"] = 22] = "IQ3_XS";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ3_XXS"] = 23] = "IQ3_XXS";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ1_S"] = 24] = "IQ1_S";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ4_NL"] = 25] = "IQ4_NL";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ3_S"] = 26] = "IQ3_S";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ3_M"] = 27] = "IQ3_M";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ2_S"] = 28] = "IQ2_S";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ2_M"] = 29] = "IQ2_M";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ4_XS"] = 30] = "IQ4_XS";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["IQ1_M"] = 31] = "IQ1_M";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["BF16"] = 32] = "BF16";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_0_4_4"] = 33] = "Q4_0_4_4";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_0_4_8"] = 34] = "Q4_0_4_8";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_0_8_8"] = 35] = "Q4_0_8_8";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["TQ1_0"] = 36] = "TQ1_0";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["TQ2_0"] = 37] = "TQ2_0";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["MXFP4_MOE"] = 38] = "MXFP4_MOE";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q2_K_XL"] = 1e3] = "Q2_K_XL";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q3_K_XL"] = 1001] = "Q3_K_XL";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q4_K_XL"] = 1002] = "Q4_K_XL";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q5_K_XL"] = 1003] = "Q5_K_XL";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q6_K_XL"] = 1004] = "Q6_K_XL";
      GGMLFileQuantizationType2[GGMLFileQuantizationType2["Q8_K_XL"] = 1005] = "Q8_K_XL";
    })(GGMLFileQuantizationType || (exports2.GGMLFileQuantizationType = GGMLFileQuantizationType = {}));
    var ggufQuants = Object.values(GGMLFileQuantizationType).filter((v) => typeof v === "string");
    exports2.GGUF_QUANT_RE = new RegExp(`(?<quant>${ggufQuants.join("|")})(_(?<sizeVariation>[A-Z]+))?`);
    exports2.GGUF_QUANT_RE_GLOBAL = new RegExp(exports2.GGUF_QUANT_RE, "g");
    function parseGGUFQuantLabel(fname) {
      const quantLabel = fname.toUpperCase().match(exports2.GGUF_QUANT_RE_GLOBAL)?.at(-1);
      return quantLabel;
    }
    exports2.GGUF_QUANT_ORDER = [
      GGMLFileQuantizationType.F32,
      GGMLFileQuantizationType.BF16,
      GGMLFileQuantizationType.F16,
      GGMLFileQuantizationType.Q8_K_XL,
      GGMLFileQuantizationType.Q8_0,
      // 6-bit quantizations
      GGMLFileQuantizationType.Q6_K_XL,
      GGMLFileQuantizationType.Q6_K,
      // 5-bit quantizations
      GGMLFileQuantizationType.Q5_K_XL,
      GGMLFileQuantizationType.Q5_K_M,
      GGMLFileQuantizationType.Q5_K_S,
      GGMLFileQuantizationType.Q5_0,
      GGMLFileQuantizationType.Q5_1,
      // 4-bit quantizations
      GGMLFileQuantizationType.Q4_K_XL,
      GGMLFileQuantizationType.Q4_K_M,
      GGMLFileQuantizationType.Q4_K_S,
      GGMLFileQuantizationType.IQ4_NL,
      GGMLFileQuantizationType.IQ4_XS,
      GGMLFileQuantizationType.Q4_0_4_4,
      GGMLFileQuantizationType.Q4_0_4_8,
      GGMLFileQuantizationType.Q4_0_8_8,
      GGMLFileQuantizationType.Q4_1_SOME_F16,
      GGMLFileQuantizationType.Q4_0,
      GGMLFileQuantizationType.Q4_1,
      GGMLFileQuantizationType.Q4_2,
      GGMLFileQuantizationType.Q4_3,
      GGMLFileQuantizationType.MXFP4_MOE,
      // 3-bit quantizations
      GGMLFileQuantizationType.Q3_K_XL,
      GGMLFileQuantizationType.Q3_K_L,
      GGMLFileQuantizationType.Q3_K_M,
      GGMLFileQuantizationType.Q3_K_S,
      GGMLFileQuantizationType.IQ3_M,
      GGMLFileQuantizationType.IQ3_S,
      GGMLFileQuantizationType.IQ3_XS,
      GGMLFileQuantizationType.IQ3_XXS,
      // 2-bit quantizations
      GGMLFileQuantizationType.Q2_K_XL,
      GGMLFileQuantizationType.Q2_K,
      GGMLFileQuantizationType.Q2_K_S,
      GGMLFileQuantizationType.IQ2_M,
      GGMLFileQuantizationType.IQ2_S,
      GGMLFileQuantizationType.IQ2_XS,
      GGMLFileQuantizationType.IQ2_XXS,
      // 1-bit quantizations
      GGMLFileQuantizationType.IQ1_S,
      GGMLFileQuantizationType.IQ1_M,
      GGMLFileQuantizationType.TQ1_0,
      GGMLFileQuantizationType.TQ2_0
    ];
    function findNearestQuantType(quant, availableQuants) {
      const orderMap = /* @__PURE__ */ new Map();
      exports2.GGUF_QUANT_ORDER.forEach((q, index) => {
        orderMap.set(q, index);
      });
      const targetIndex = orderMap.get(quant) ?? 0;
      const sortedAvailable = availableQuants.filter((q) => orderMap.has(q)).sort((a, b) => (orderMap.get(a) ?? Infinity) - (orderMap.get(b) ?? Infinity));
      if (sortedAvailable.length === 0) {
        return void 0;
      }
      for (const availableQuant of sortedAvailable) {
        const availableIndex = orderMap.get(availableQuant) ?? 0;
        if (availableIndex >= targetIndex) {
          return availableQuant;
        }
      }
      return sortedAvailable[sortedAvailable.length - 1];
    }
    var GGMLQuantizationType;
    (function(GGMLQuantizationType2) {
      GGMLQuantizationType2[GGMLQuantizationType2["F32"] = 0] = "F32";
      GGMLQuantizationType2[GGMLQuantizationType2["F16"] = 1] = "F16";
      GGMLQuantizationType2[GGMLQuantizationType2["Q4_0"] = 2] = "Q4_0";
      GGMLQuantizationType2[GGMLQuantizationType2["Q4_1"] = 3] = "Q4_1";
      GGMLQuantizationType2[GGMLQuantizationType2["Q5_0"] = 6] = "Q5_0";
      GGMLQuantizationType2[GGMLQuantizationType2["Q5_1"] = 7] = "Q5_1";
      GGMLQuantizationType2[GGMLQuantizationType2["Q8_0"] = 8] = "Q8_0";
      GGMLQuantizationType2[GGMLQuantizationType2["Q8_1"] = 9] = "Q8_1";
      GGMLQuantizationType2[GGMLQuantizationType2["Q2_K"] = 10] = "Q2_K";
      GGMLQuantizationType2[GGMLQuantizationType2["Q3_K"] = 11] = "Q3_K";
      GGMLQuantizationType2[GGMLQuantizationType2["Q4_K"] = 12] = "Q4_K";
      GGMLQuantizationType2[GGMLQuantizationType2["Q5_K"] = 13] = "Q5_K";
      GGMLQuantizationType2[GGMLQuantizationType2["Q6_K"] = 14] = "Q6_K";
      GGMLQuantizationType2[GGMLQuantizationType2["Q8_K"] = 15] = "Q8_K";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ2_XXS"] = 16] = "IQ2_XXS";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ2_XS"] = 17] = "IQ2_XS";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ3_XXS"] = 18] = "IQ3_XXS";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ1_S"] = 19] = "IQ1_S";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ4_NL"] = 20] = "IQ4_NL";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ3_S"] = 21] = "IQ3_S";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ2_S"] = 22] = "IQ2_S";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ4_XS"] = 23] = "IQ4_XS";
      GGMLQuantizationType2[GGMLQuantizationType2["I8"] = 24] = "I8";
      GGMLQuantizationType2[GGMLQuantizationType2["I16"] = 25] = "I16";
      GGMLQuantizationType2[GGMLQuantizationType2["I32"] = 26] = "I32";
      GGMLQuantizationType2[GGMLQuantizationType2["I64"] = 27] = "I64";
      GGMLQuantizationType2[GGMLQuantizationType2["F64"] = 28] = "F64";
      GGMLQuantizationType2[GGMLQuantizationType2["IQ1_M"] = 29] = "IQ1_M";
      GGMLQuantizationType2[GGMLQuantizationType2["BF16"] = 30] = "BF16";
      GGMLQuantizationType2[GGMLQuantizationType2["TQ1_0"] = 34] = "TQ1_0";
      GGMLQuantizationType2[GGMLQuantizationType2["TQ2_0"] = 35] = "TQ2_0";
      GGMLQuantizationType2[GGMLQuantizationType2["MXFP4"] = 39] = "MXFP4";
    })(GGMLQuantizationType || (exports2.GGMLQuantizationType = GGMLQuantizationType = {}));
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/snippets/types.js
var require_types2 = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/snippets/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.inferenceSnippetLanguages = void 0;
    exports2.inferenceSnippetLanguages = ["python", "js", "sh"];
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/snippets/index.js
var require_snippets = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/snippets/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_common(), exports2);
    __exportStar(require_inputs(), exports2);
    __exportStar(require_types2(), exports2);
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/hardware.js
var require_hardware = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/hardware.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SKUS = exports2.DEFAULT_MEMORY_OPTIONS = exports2.TFLOPS_THRESHOLD_EU_AI_ACT_MODEL_TRAINING_TOTAL = exports2.TFLOPS_THRESHOLD_WHITE_HOUSE_CLUSTER = exports2.TFLOPS_THRESHOLD_WHITE_HOUSE_MODEL_TRAINING_TOTAL_BIOLOGY = exports2.TFLOPS_THRESHOLD_WHITE_HOUSE_MODEL_TRAINING_TOTAL = void 0;
    exports2.TFLOPS_THRESHOLD_WHITE_HOUSE_MODEL_TRAINING_TOTAL = 10 ** 14;
    exports2.TFLOPS_THRESHOLD_WHITE_HOUSE_MODEL_TRAINING_TOTAL_BIOLOGY = 10 ** 11;
    exports2.TFLOPS_THRESHOLD_WHITE_HOUSE_CLUSTER = 10 ** 8;
    exports2.TFLOPS_THRESHOLD_EU_AI_ACT_MODEL_TRAINING_TOTAL = 10 ** 13;
    exports2.DEFAULT_MEMORY_OPTIONS = [
      8,
      16,
      24,
      32,
      40,
      48,
      64,
      80,
      96,
      128,
      192,
      256,
      384,
      512,
      768,
      1024,
      1536,
      2048
    ];
    exports2.SKUS = {
      GPU: {
        NVIDIA: {
          B200: {
            tflops: 496.6,
            memory: [192]
          },
          H200: {
            tflops: 241.3,
            memory: [141]
          },
          H100: {
            tflops: 267.6,
            memory: [80]
          },
          L40s: {
            tflops: 91.61,
            memory: [48]
          },
          L40: {
            tflops: 90.52,
            memory: [48]
          },
          L20: {
            tflops: 59.35,
            memory: [48]
          },
          L4: {
            tflops: 30.29,
            memory: [24]
          },
          GB10: {
            tflops: 29.71,
            memory: [128]
          },
          "RTX PRO 6000 WS": {
            tflops: 126,
            memory: [96]
          },
          "RTX PRO 6000 Max-Q": {
            tflops: 116,
            memory: [96]
          },
          "RTX 6000 Ada": {
            tflops: 91.1,
            memory: [48]
          },
          "RTX 5880 Ada": {
            tflops: 69.3,
            memory: [48]
          },
          "RTX 5000 Ada": {
            tflops: 65.3,
            memory: [32]
          },
          "RTX 4500 Ada": {
            tflops: 39.6,
            memory: [24]
          },
          "RTX 4000 Ada": {
            tflops: 26.7,
            memory: [20]
          },
          "RTX 4000 SFF Ada": {
            tflops: 19.2,
            memory: [20]
          },
          "RTX 2000 Ada": {
            tflops: 12,
            memory: [16]
          },
          "RTX A6000": {
            tflops: 38.7,
            memory: [48]
          },
          "RTX A5000": {
            tflops: 34.1,
            memory: [24]
          },
          "RTX A4000": {
            tflops: 19.2,
            memory: [16]
          },
          "RTX A2000": {
            tflops: 7.987,
            memory: [8, 12]
          },
          A100: {
            tflops: 77.97,
            memory: [80, 40]
          },
          A40: {
            tflops: 37.42,
            memory: [48]
          },
          A10: {
            tflops: 31.24,
            memory: [24]
          },
          A2: {
            tflops: 4.531,
            // source: https://www.techpowerup.com/gpu-specs/a2.c3848
            memory: [16]
          },
          "RTX 5090": {
            tflops: 104.8,
            memory: [32]
          },
          "RTX 5090 D": {
            tflops: 104.8,
            memory: [32]
          },
          "RTX 5080": {
            tflops: 56.28,
            memory: [16]
          },
          "RTX 5080 Mobile": {
            tflops: 24.58,
            memory: [16]
          },
          "RTX 5070": {
            tflops: 30.84,
            memory: [12]
          },
          "RTX 5070 Mobile": {
            tflops: 23.22,
            memory: [8]
          },
          "RTX 5070 Ti": {
            tflops: 43.94,
            memory: [16]
          },
          "RTX 5060 Ti": {
            tflops: 23.7,
            // source https://www.techpowerup.com/gpu-specs/geforce-rtx-5060-ti.c4246
            memory: [16, 8]
          },
          "RTX 5060": {
            tflops: 19.18,
            // source https://www.techpowerup.com/gpu-specs/geforce-rtx-5060.c4219
            memory: [8]
          },
          "RTX 4090": {
            tflops: 82.58,
            memory: [24]
          },
          "RTX 4090D": {
            tflops: 79.49,
            memory: [24, 48]
          },
          "RTX 4090 Mobile": {
            tflops: 32.98,
            memory: [16]
          },
          "RTX 4080 SUPER": {
            tflops: 52.2,
            memory: [16]
          },
          "RTX 4080": {
            tflops: 48.7,
            memory: [16]
          },
          "RTX 4080 Mobile": {
            tflops: 24.72,
            memory: [12]
          },
          "RTX 4070": {
            tflops: 29.15,
            memory: [12]
          },
          "RTX 4070 Mobile": {
            tflops: 15.62,
            memory: [8]
          },
          "RTX 4070 Ti": {
            tflops: 40.09,
            memory: [12]
          },
          "RTX 4070 Super": {
            tflops: 35.48,
            memory: [12]
          },
          "RTX 4070 Ti Super": {
            tflops: 44.1,
            memory: [16]
          },
          "RTX 4060": {
            tflops: 15.11,
            memory: [8]
          },
          "RTX 4060 Ti": {
            tflops: 22.06,
            memory: [8, 16]
          },
          "RTX 4090 Laptop": {
            tflops: 32.98,
            memory: [16]
          },
          "RTX 4080 Laptop": {
            tflops: 24.72,
            memory: [12]
          },
          "RTX 4070 Laptop": {
            tflops: 15.62,
            memory: [8]
          },
          "RTX 4060 Laptop": {
            tflops: 11.61,
            memory: [8]
          },
          "RTX 4050 Laptop": {
            tflops: 8.9,
            memory: [6]
          },
          "RTX 3090": {
            tflops: 35.58,
            memory: [24]
          },
          "RTX 3090 Ti": {
            tflops: 40,
            memory: [24]
          },
          "RTX 3080": {
            tflops: 30.6,
            memory: [12, 10]
          },
          "RTX 3080 Ti": {
            tflops: 34.1,
            memory: [12]
          },
          "RTX 3080 Mobile": {
            tflops: 18.98,
            memory: [8]
          },
          "RTX 3070": {
            tflops: 20.31,
            memory: [8]
          },
          "RTX 3070 Ti": {
            tflops: 21.75,
            memory: [8]
          },
          "RTX 3070 Ti Mobile": {
            tflops: 16.6,
            memory: [8]
          },
          "RTX 3060 Ti": {
            tflops: 16.2,
            memory: [8]
          },
          "RTX 3060": {
            tflops: 12.74,
            memory: [12, 8]
          },
          "RTX 2080 Ti": {
            tflops: 26.9,
            memory: [11, 22]
            // 22GB: modded 2080ti
          },
          "RTX 2080": {
            tflops: 20.14,
            memory: [8]
          },
          "RTX 2070": {
            tflops: 14.93,
            memory: [8]
          },
          "RTX 2070 SUPER Mobile": {
            tflops: 14.13,
            memory: [8]
          },
          "RTX 2070 SUPER": {
            tflops: 18.12,
            memory: [8]
          },
          "RTX 3060 Mobile": {
            tflops: 10.94,
            memory: [6]
          },
          "RTX 3050 Mobile": {
            tflops: 7.639,
            memory: [4, 6]
          },
          "RTX 2060": {
            tflops: 12.9,
            memory: [6]
          },
          "RTX 2060 12GB": {
            tflops: 14.36,
            memory: [12]
          },
          "RTX 2060 Mobile": {
            tflops: 9.22,
            memory: [6]
          },
          "GTX 1080 Ti": {
            tflops: 11.34,
            // float32 (GPU does not support native float16)
            memory: [11]
          },
          "GTX 1070 Ti": {
            tflops: 8.2,
            // float32 (GPU does not support native float16)
            memory: [8]
          },
          "GTX 1060": {
            tflops: 3.9,
            // float32 (GPU does not support native float16)
            memory: [3, 6]
          },
          "GTX 1050 Ti": {
            tflops: 2.1,
            // float32 (GPU does not support native float16)
            memory: [4]
          },
          "RTX Titan": {
            tflops: 32.62,
            memory: [24]
          },
          "GTX 1660": {
            tflops: 10.05,
            memory: [6]
          },
          "GTX 1650 Mobile": {
            tflops: 6.39,
            memory: [4]
          },
          T4: {
            tflops: 65.13,
            memory: [16]
          },
          T10: {
            tflops: 20,
            memory: [16]
          },
          V100: {
            tflops: 28.26,
            memory: [32, 16]
          },
          "Quadro P6000": {
            tflops: 12.63,
            // float32 (GPU does not support native float16)
            memory: [24]
          },
          P40: {
            tflops: 11.76,
            // float32 (GPU does not support native float16)
            memory: [24]
          },
          P100: {
            tflops: 19.05,
            memory: [16]
          },
          "Jetson AGX Orin 64GB": {
            tflops: 10.65,
            memory: [64]
          },
          "Jetson AGX Orin 32GB": {
            tflops: 6.66,
            memory: [32]
          },
          "Jetson Orin NX 16GB": {
            tflops: 3.76,
            memory: [16]
          },
          "Jetson Orin NX 8GB": {
            tflops: 3.13,
            memory: [8]
          },
          "Jetson Orin Nano 8GB": {
            tflops: 2.56,
            memory: [8]
          },
          "Jetson Orin Nano 4GB": {
            tflops: 1.28,
            memory: [4]
          },
          "Jetson AGX Xavier": {
            tflops: 2.82,
            memory: [32, 64]
          },
          "Jetson Xavier NX": {
            tflops: 1.69,
            memory: [8, 16]
          },
          "Jetson TX2": {
            tflops: 1.33,
            memory: [4, 8]
          },
          "Jetson Nano": {
            tflops: 0.47,
            memory: [4]
          }
        },
        AMD: {
          MI300: {
            tflops: 383,
            memory: [192]
          },
          MI250: {
            tflops: 362.1,
            memory: [128]
          },
          MI210: {
            tflops: 181,
            memory: [64]
          },
          MI100: {
            tflops: 184.6,
            memory: [32]
          },
          MI60: {
            tflops: 29.5,
            memory: [32]
          },
          MI50: {
            tflops: 26.5,
            memory: [16, 32]
          },
          "RX 9070 XT": {
            tflops: 97.32,
            memory: [16]
          },
          "RX 9070": {
            tflops: 72.25,
            memory: [16]
          },
          "RX 7900 XTX": {
            tflops: 122.8,
            memory: [24]
          },
          "RX 7900 XT": {
            tflops: 103,
            memory: [20]
          },
          "RX 7900 GRE": {
            tflops: 91.96,
            memory: [16]
          },
          "RX 7800 XT": {
            tflops: 74.65,
            memory: [16]
          },
          "RX 7700 XT": {
            tflops: 70.34,
            memory: [12]
          },
          "RX 7600 XT": {
            tflops: 45.14,
            memory: [16, 8]
          },
          "RX 6950 XT": {
            tflops: 47.31,
            memory: [16]
          },
          "RX 6800": {
            tflops: 32.33,
            memory: [16]
          },
          "RX 6700 XT": {
            tflops: 26.43,
            memory: [12]
          },
          "RX 6700": {
            tflops: 22.58,
            memory: [10]
          },
          "RX 6650 XT": {
            tflops: 21.59,
            memory: [8]
          },
          "RX 6600 XT": {
            tflops: 21.21,
            memory: [8]
          },
          "RX 6600": {
            tflops: 17.86,
            memory: [8]
          },
          "Radeon Pro VII": {
            tflops: 26.11,
            memory: [16, 32]
          }
        },
        INTEL: {
          "Arc A750": {
            tflops: 34.41,
            memory: [8]
          },
          "Arc A770": {
            tflops: 39.32,
            memory: [8, 16]
          },
          "Arc B570": {
            tflops: 23.04,
            memory: [10]
          },
          "Arc B580": {
            tflops: 27.34,
            memory: [12]
          },
          "Arc B50": {
            tflops: 21.3,
            memory: [16]
          },
          "Arc B60": {
            tflops: 24.58,
            memory: [24, 48]
          }
        },
        QUALCOMM: {
          "Snapdragon X Elite X1E-00-1DE": {
            tflops: 4.6
          },
          "Snapdragon X Elite X1E-84-100": {
            tflops: 4.6
          },
          "Snapdragon X Elite X1E-80-100": {
            tflops: 3.8
          },
          "Snapdragon X Elite X1E-78-100": {
            tflops: 3.8
          },
          "Snapdragon X Plus X1P-64-100": {
            tflops: 3.8
          }
        }
      },
      CPU: {
        Intel: {
          "Xeon 4th Generation (Sapphire Rapids)": {
            tflops: 1.3
          },
          "Xeon 3th Generation (Ice Lake)": {
            tflops: 0.8
          },
          "Xeon 2th Generation (Cascade Lake)": {
            tflops: 0.55
          },
          "Xeon E5v4 (Broadwell)": {
            tflops: 0.25
          },
          "Xeon E5v3 (Haswell)": {
            tflops: 0.2
          },
          "Xeon E5v2 (Ivy Bridge)": {
            tflops: 0.15
          },
          "Intel Core Ultra 7 265KF": {
            tflops: 1.53
          },
          "Intel Core 14th Generation (i7)": {
            tflops: 0.8
          },
          "Intel Core 13th Generation (i9)": {
            tflops: 0.85
          },
          "Intel Core 13th Generation (i7)": {
            tflops: 0.82
          },
          "Intel Core 13th Generation (i5)": {
            tflops: 0.68
          },
          "Intel Core 13th Generation (i3)": {
            tflops: 0.57
          },
          "Intel Core 12th Generation (i9)": {
            tflops: 0.79
          },
          "Intel Core 12th Generation (i7)": {
            tflops: 0.77
          },
          "Intel Core 12th Generation (i5)": {
            tflops: 0.65
          },
          "Intel Core 12th Generation (i3)": {
            tflops: 0.53
          },
          "Intel Core 11th Generation (i9)": {
            tflops: 0.7
          },
          "Intel Core 11th Generation (i7)": {
            tflops: 0.6
          },
          "Intel Core 11th Generation (i5)": {
            tflops: 0.5
          },
          "Intel Core 11th Generation (i3)": {
            tflops: 0.35
          },
          "Intel Core 10th Generation (i9)": {
            tflops: 0.46
          },
          "Intel Core 10th Generation (i7)": {
            tflops: 0.46
          },
          "Intel Core 10th Generation (i5)": {
            tflops: 0.46
          },
          "Intel Core 10th Generation (i3)": {
            tflops: 0.44
          }
        },
        AMD: {
          "EPYC 5th Generation Zen 5 (Turin)": {
            tflops: 13.8
          },
          "EPYC 4th Generation Zen 4 (Genoa)": {
            tflops: 5
          },
          "EPYC 3th Generation Zen 3 (Milan)": {
            tflops: 2.4
          },
          "EPYC 2th Generation Zen 2 (Rome)": {
            tflops: 0.6
          },
          "EPYC 1st Generation Zen (Naples)": {
            tflops: 0.6
          },
          "Ryzen Threadripper Zen 5 9000 (Shimada Peak)": {
            tflops: 14
          },
          "Ryzen Threadripper Zen 4 7000 (Storm Peak)": {
            tflops: 10
          },
          "Ryzen Threadripper Zen 3 5000 (Chagall)": {
            tflops: 4.6
          },
          "Ryzen Threadripper Zen 2 3000 (Castle Peak)": {
            tflops: 3.2
          },
          "Ryzen Threadripper Zen 1000 (Whitehaven)": {
            tflops: 0.6
          },
          "Ryzen Zen 5 9000 (Ryzen 9)": {
            tflops: 0.56
          },
          "Ryzen Zen 5 9000 (Ryzen 7)": {
            tflops: 0.56
          },
          "Ryzen Zen 5 9000 (Ryzen 5)": {
            tflops: 0.56
          },
          "Ryzen Zen 4 7000 (Ryzen 9)": {
            tflops: 0.56
          },
          "Ryzen Zen 4 7000 (Ryzen 7)": {
            tflops: 0.56
          },
          "Ryzen Zen 4 7000 (Ryzen 5)": {
            tflops: 0.56
          },
          "Ryzen Zen 3 5000 (Ryzen 9)": {
            tflops: 1.33
          },
          "Ryzen Zen 3 5000 (Ryzen 7)": {
            tflops: 1.33
          },
          "Ryzen Zen 3 5000 (Ryzen 5)": {
            tflops: 0.72
          },
          "Ryzen Zen 2 3000 (Ryzen 9)": {
            tflops: 0.72
          },
          "Ryzen Zen 2 3000 (Ryzen 7)": {
            tflops: 0.72
          },
          "Ryzen Zen 2 3000 (Ryzen 5)": {
            tflops: 0.72
          },
          "Ryzen Zen 2 3000 (Ryzen 3)": {
            tflops: 0.72
          }
        }
      },
      "Apple Silicon": {
        "-": {
          "Apple M1": {
            tflops: 2.6,
            memory: [8, 16]
          },
          "Apple M1 Pro": {
            tflops: 5.2,
            memory: [16, 24, 32]
          },
          "Apple M1 Max": {
            tflops: 10.4,
            memory: [16, 24, 32, 64]
          },
          "Apple M1 Ultra": {
            tflops: 21,
            memory: [16, 24, 32, 64, 96, 128]
          },
          "Apple M2": {
            tflops: 3.6,
            memory: [8, 16, 24]
          },
          "Apple M2 Pro": {
            tflops: 6.8,
            memory: [16, 24, 32]
          },
          "Apple M2 Max": {
            tflops: 13.49,
            memory: [32, 64, 96]
          },
          "Apple M2 Ultra": {
            tflops: 27.2,
            memory: [64, 96, 128, 192]
          },
          "Apple M3": {
            tflops: 4.1,
            memory: [8, 16, 24]
          },
          "Apple M3 Pro": {
            tflops: 7.4,
            memory: [18, 36]
          },
          "Apple M3 Max": {
            tflops: 14.2,
            memory: [36, 48, 64, 96, 128]
          },
          "Apple M3 Ultra": {
            tflops: 28.4,
            memory: [96, 256, 512]
          },
          "Apple M4": {
            tflops: 4.6,
            memory: [16, 24, 32]
          },
          "Apple M4 Pro": {
            tflops: 9.2,
            memory: [24, 48, 64]
          },
          "Apple M4 Max": {
            tflops: 18.4,
            memory: [36, 48, 64, 96, 128, 256, 512]
          },
          "Apple M5": {
            tflops: 5.7,
            memory: [16, 24, 32]
          }
        }
      }
    };
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/local-apps.js
var require_local_apps = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/local-apps.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LOCAL_APPS = void 0;
    var gguf_js_1 = require_gguf();
    var common_js_1 = require_common();
    var inputs_js_1 = require_inputs();
    function isAwqModel(model) {
      return model.config?.quantization_config?.quant_method === "awq";
    }
    function isGptqModel(model) {
      return model.config?.quantization_config?.quant_method === "gptq";
    }
    function isAqlmModel(model) {
      return model.config?.quantization_config?.quant_method === "aqlm";
    }
    function isMarlinModel(model) {
      return model.config?.quantization_config?.quant_method === "marlin";
    }
    function isTransformersModel(model) {
      return model.tags.includes("transformers");
    }
    function isTgiModel(model) {
      return model.tags.includes("text-generation-inference");
    }
    function isLlamaCppGgufModel(model) {
      return !!model.gguf?.context_length;
    }
    function isAmdRyzenModel(model) {
      return model.tags.includes("ryzenai-hybrid") || model.tags.includes("ryzenai-npu");
    }
    function isMlxModel(model) {
      return model.tags.includes("mlx");
    }
    function getQuantTag(filepath) {
      const defaultTag = ":{{QUANT_TAG}}";
      if (!filepath) {
        return defaultTag;
      }
      const quantLabel = (0, gguf_js_1.parseGGUFQuantLabel)(filepath);
      return quantLabel ? `:${quantLabel}` : defaultTag;
    }
    var snippetLlamacpp = (model, filepath) => {
      const command = (binary) => {
        const snippet = ["# Load and run the model:", `${binary} -hf ${model.id}${getQuantTag(filepath)}`];
        return snippet.join("\n");
      };
      return [
        {
          title: "Install from brew",
          setup: "brew install llama.cpp",
          content: command("llama-server")
        },
        {
          title: "Install from WinGet (Windows)",
          setup: "winget install llama.cpp",
          content: command("llama-server")
        },
        {
          title: "Use pre-built binary",
          setup: [
            // prettier-ignore
            "# Download pre-built binary from:",
            "# https://github.com/ggerganov/llama.cpp/releases"
          ].join("\n"),
          content: command("./llama-server")
        },
        {
          title: "Build from source code",
          setup: [
            "git clone https://github.com/ggerganov/llama.cpp.git",
            "cd llama.cpp",
            "cmake -B build",
            "cmake --build build -j --target llama-server"
          ].join("\n"),
          content: command("./build/bin/llama-server")
        }
      ];
    };
    var snippetNodeLlamaCppCli = (model, filepath) => {
      const tagName = getQuantTag(filepath);
      return [
        {
          title: "Chat with the model",
          content: `npx -y node-llama-cpp chat hf:${model.id}${tagName}`
        },
        {
          title: "Estimate the model compatibility with your hardware",
          content: `npx -y node-llama-cpp inspect estimate hf:${model.id}${tagName}`
        }
      ];
    };
    var snippetOllama = (model, filepath) => {
      return `ollama run hf.co/${model.id}${getQuantTag(filepath)}`;
    };
    var snippetLocalAI = (model, filepath) => {
      const command = (binary) => ["# Load and run the model:", `${binary} huggingface://${model.id}/${filepath ?? "{{GGUF_FILE}}"}`].join("\n");
      return [
        {
          title: "Install from binary",
          setup: "curl https://localai.io/install.sh | sh",
          content: command("local-ai run")
        },
        {
          title: "Use Docker images",
          setup: [
            // prettier-ignore
            "# Pull the image:",
            "docker pull localai/localai:latest-cpu"
          ].join("\n"),
          content: command("docker run -p 8080:8080 --name localai -v $PWD/models:/build/models localai/localai:latest-cpu")
        }
      ];
    };
    var snippetVllm = (model) => {
      const messages = (0, inputs_js_1.getModelInputSnippet)(model);
      const runCommandInstruct = `# Call the server using curl:
curl -X POST "http://localhost:8000/v1/chat/completions" \\
	-H "Content-Type: application/json" \\
	--data '{
		"model": "${model.id}",
		"messages": ${(0, common_js_1.stringifyMessages)(messages, {
        indent: "		",
        attributeKeyQuotes: true,
        customContentEscaper: (str) => str.replace(/'/g, "'\\''")
      })}
	}'`;
      const runCommandNonInstruct = `# Call the server using curl:
curl -X POST "http://localhost:8000/v1/completions" \\
	-H "Content-Type: application/json" \\
	--data '{
		"model": "${model.id}",
		"prompt": "Once upon a time,",
		"max_tokens": 512,
		"temperature": 0.5
	}'`;
      const runCommand = model.tags.includes("conversational") ? runCommandInstruct : runCommandNonInstruct;
      let setup;
      let dockerCommand;
      if (model.tags.includes("mistral-common")) {
        setup = [
          "# Install vLLM from pip:",
          "pip install vllm",
          "# Make sure you have the latest version of mistral-common installed:",
          "pip install --upgrade mistral-common"
        ].join("\n");
        dockerCommand = `# Load and run the model:
docker exec -it my_vllm_container bash -c "vllm serve ${model.id} --tokenizer_mode mistral --config_format mistral --load_format mistral --tool-call-parser mistral --enable-auto-tool-choice"`;
      } else {
        setup = ["# Install vLLM from pip:", "pip install vllm"].join("\n");
        dockerCommand = `# Load and run the model:
docker exec -it my_vllm_container bash -c "vllm serve ${model.id}"`;
      }
      return [
        {
          title: "Install from pip",
          setup,
          content: [`# Load and run the model:
vllm serve "${model.id}"`, runCommand]
        },
        {
          title: "Use Docker images",
          setup: [
            "# Deploy with docker on Linux:",
            `docker run --runtime nvidia --gpus all \\`,
            `	--name my_vllm_container \\`,
            `	-v ~/.cache/huggingface:/root/.cache/huggingface \\`,
            ` 	--env "HUGGING_FACE_HUB_TOKEN=<secret>" \\`,
            `	-p 8000:8000 \\`,
            `	--ipc=host \\`,
            `	vllm/vllm-openai:latest \\`,
            `	--model ${model.id}`
          ].join("\n"),
          content: [dockerCommand, runCommand]
        }
      ];
    };
    var snippetTgi = (model) => {
      const runCommand = [
        "# Call the server using curl:",
        `curl -X POST "http://localhost:8000/v1/chat/completions" \\`,
        `	-H "Content-Type: application/json" \\`,
        `	--data '{`,
        `		"model": "${model.id}",`,
        `		"messages": [`,
        `			{"role": "user", "content": "What is the capital of France?"}`,
        `		]`,
        `	}'`
      ];
      return [
        {
          title: "Use Docker images",
          setup: [
            "# Deploy with docker on Linux:",
            `docker run --gpus all \\`,
            `	-v ~/.cache/huggingface:/root/.cache/huggingface \\`,
            ` 	-e HF_TOKEN="<secret>" \\`,
            `	-p 8000:80 \\`,
            `	ghcr.io/huggingface/text-generation-inference:latest \\`,
            `	--model-id ${model.id}`
          ].join("\n"),
          content: [runCommand.join("\n")]
        }
      ];
    };
    var snippetMlxLm = (model) => {
      const openaiCurl = [
        "# Calling the OpenAI-compatible server with curl",
        `curl -X POST "http://localhost:8000/v1/chat/completions" \\`,
        `   -H "Content-Type: application/json" \\`,
        `   --data '{`,
        `     "model": "${model.id}",`,
        `     "messages": [`,
        `       {"role": "user", "content": "Hello"}`,
        `     ]`,
        `   }'`
      ];
      return [
        {
          title: "Generate or start a chat session",
          setup: ["# Install MLX LM", "uv tool install mlx-lm"].join("\n"),
          content: [
            ...model.tags.includes("conversational") ? ["# Interactive chat REPL", `mlx_lm.chat --model "${model.id}"`] : ["# Generate some text", `mlx_lm.generate --model "${model.id}" --prompt "Once upon a time"`]
          ].join("\n")
        },
        ...model.tags.includes("conversational") ? [
          {
            title: "Run an OpenAI-compatible server",
            setup: ["# Install MLX LM", "uv tool install mlx-lm"].join("\n"),
            content: ["# Start the server", `mlx_lm.server --model "${model.id}"`, ...openaiCurl].join("\n")
          }
        ] : []
      ];
    };
    var snippetDockerModelRunner = (model, filepath) => {
      return `docker model run hf.co/${model.id}${getQuantTag(filepath)}`;
    };
    var snippetLemonade = (model, filepath) => {
      const tagName = getQuantTag(filepath);
      const modelName = model.id.includes("/") ? model.id.split("/")[1] : model.id;
      let simplifiedModelName;
      let recipe;
      let checkpoint;
      let requirements;
      if (model.tags.some((tag) => ["ryzenai-npu", "ryzenai-hybrid"].includes(tag))) {
        recipe = model.tags.includes("ryzenai-npu") ? "oga-npu" : "oga-hybrid";
        checkpoint = model.id;
        requirements = " (requires RyzenAI 300 series)";
        simplifiedModelName = modelName.split("-awq-")[0];
        simplifiedModelName += recipe === "oga-npu" ? "-NPU" : "-Hybrid";
      } else {
        recipe = "llamacpp";
        checkpoint = `${model.id}${tagName}`;
        requirements = "";
        simplifiedModelName = modelName;
      }
      return [
        {
          title: "Pull the model",
          setup: "# Download Lemonade from https://lemonade-server.ai/",
          content: [
            `lemonade-server pull user.${simplifiedModelName} --checkpoint ${checkpoint} --recipe ${recipe}`,
            "# Note: If you installed from source, use the lemonade-server-dev command instead."
          ].join("\n")
        },
        {
          title: `Run and chat with the model${requirements}`,
          content: `lemonade-server run user.${simplifiedModelName}`
        },
        {
          title: "List all available models",
          content: "lemonade-server list"
        }
      ];
    };
    exports2.LOCAL_APPS = {
      "llama.cpp": {
        prettyLabel: "llama.cpp",
        docsUrl: "https://github.com/ggerganov/llama.cpp",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        snippet: snippetLlamacpp
      },
      "node-llama-cpp": {
        prettyLabel: "node-llama-cpp",
        docsUrl: "https://node-llama-cpp.withcat.ai",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        snippet: snippetNodeLlamaCppCli
      },
      vllm: {
        prettyLabel: "vLLM",
        docsUrl: "https://docs.vllm.ai",
        mainTask: "text-generation",
        displayOnModelPage: (model) => (isAwqModel(model) || isGptqModel(model) || isAqlmModel(model) || isMarlinModel(model) || isLlamaCppGgufModel(model) || isTransformersModel(model)) && (model.pipeline_tag === "text-generation" || model.pipeline_tag === "image-text-to-text"),
        snippet: snippetVllm
      },
      "mlx-lm": {
        prettyLabel: "MLX LM",
        docsUrl: "https://github.com/ml-explore/mlx-lm",
        mainTask: "text-generation",
        displayOnModelPage: (model) => model.pipeline_tag === "text-generation" && isMlxModel(model),
        snippet: snippetMlxLm
      },
      tgi: {
        prettyLabel: "TGI",
        docsUrl: "https://huggingface.co/docs/text-generation-inference/",
        mainTask: "text-generation",
        displayOnModelPage: isTgiModel,
        snippet: snippetTgi
      },
      lmstudio: {
        prettyLabel: "LM Studio",
        docsUrl: "https://lmstudio.ai",
        mainTask: "text-generation",
        displayOnModelPage: (model) => isLlamaCppGgufModel(model) || isMlxModel(model),
        deeplink: (model, filepath) => new URL(`lmstudio://open_from_hf?model=${model.id}${filepath ? `&file=${filepath}` : ""}`)
      },
      localai: {
        prettyLabel: "LocalAI",
        docsUrl: "https://github.com/mudler/LocalAI",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        snippet: snippetLocalAI
      },
      jan: {
        prettyLabel: "Jan",
        docsUrl: "https://jan.ai",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        deeplink: (model) => new URL(`jan://models/huggingface/${model.id}`)
      },
      backyard: {
        prettyLabel: "Backyard AI",
        docsUrl: "https://backyard.ai",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        deeplink: (model) => new URL(`https://backyard.ai/hf/model/${model.id}`)
      },
      sanctum: {
        prettyLabel: "Sanctum",
        docsUrl: "https://sanctum.ai",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        deeplink: (model) => new URL(`sanctum://open_from_hf?model=${model.id}`)
      },
      jellybox: {
        prettyLabel: "Jellybox",
        docsUrl: "https://jellybox.com",
        mainTask: "text-generation",
        displayOnModelPage: (model) => isLlamaCppGgufModel(model) || model.library_name === "diffusers" && model.tags.includes("safetensors") && (model.pipeline_tag === "text-to-image" || model.tags.includes("lora")),
        deeplink: (model) => {
          if (isLlamaCppGgufModel(model)) {
            return new URL(`jellybox://llm/models/huggingface/LLM/${model.id}`);
          } else if (model.tags.includes("lora")) {
            return new URL(`jellybox://image/models/huggingface/ImageLora/${model.id}`);
          } else {
            return new URL(`jellybox://image/models/huggingface/Image/${model.id}`);
          }
        }
      },
      msty: {
        prettyLabel: "Msty",
        docsUrl: "https://msty.app",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        deeplink: (model) => new URL(`msty://models/search/hf/${model.id}`)
      },
      recursechat: {
        prettyLabel: "RecurseChat",
        docsUrl: "https://recurse.chat",
        mainTask: "text-generation",
        macOSOnly: true,
        displayOnModelPage: isLlamaCppGgufModel,
        deeplink: (model) => new URL(`recursechat://new-hf-gguf-model?hf-model-id=${model.id}`)
      },
      drawthings: {
        prettyLabel: "Draw Things",
        docsUrl: "https://drawthings.ai",
        mainTask: "text-to-image",
        macOSOnly: true,
        displayOnModelPage: (model) => model.library_name === "diffusers" && (model.pipeline_tag === "text-to-image" || model.tags.includes("lora")),
        deeplink: (model) => {
          if (model.tags.includes("lora")) {
            return new URL(`https://drawthings.ai/import/diffusers/pipeline.load_lora_weights?repo_id=${model.id}`);
          } else {
            return new URL(`https://drawthings.ai/import/diffusers/pipeline.from_pretrained?repo_id=${model.id}`);
          }
        }
      },
      diffusionbee: {
        prettyLabel: "DiffusionBee",
        docsUrl: "https://diffusionbee.com",
        mainTask: "text-to-image",
        macOSOnly: true,
        displayOnModelPage: (model) => model.library_name === "diffusers" && model.pipeline_tag === "text-to-image",
        deeplink: (model) => new URL(`https://diffusionbee.com/huggingface_import?model_id=${model.id}`)
      },
      joyfusion: {
        prettyLabel: "JoyFusion",
        docsUrl: "https://joyfusion.app",
        mainTask: "text-to-image",
        macOSOnly: true,
        displayOnModelPage: (model) => model.tags.includes("coreml") && model.tags.includes("joyfusion") && model.pipeline_tag === "text-to-image",
        deeplink: (model) => new URL(`https://joyfusion.app/import_from_hf?repo_id=${model.id}`)
      },
      ollama: {
        prettyLabel: "Ollama",
        docsUrl: "https://ollama.com",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        snippet: snippetOllama
      },
      "docker-model-runner": {
        prettyLabel: "Docker Model Runner",
        docsUrl: "https://docs.docker.com/ai/model-runner/",
        mainTask: "text-generation",
        displayOnModelPage: isLlamaCppGgufModel,
        snippet: snippetDockerModelRunner
      },
      lemonade: {
        prettyLabel: "Lemonade",
        docsUrl: "https://lemonade-server.ai",
        mainTask: "text-generation",
        displayOnModelPage: (model) => isLlamaCppGgufModel(model) || isAmdRyzenModel(model),
        snippet: snippetLemonade
      }
    };
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/dataset-libraries.js
var require_dataset_libraries = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/dataset-libraries.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DATASET_LIBRARIES_UI_ELEMENTS = void 0;
    exports2.DATASET_LIBRARIES_UI_ELEMENTS = {
      mlcroissant: {
        prettyLabel: "Croissant",
        repoName: "croissant",
        repoUrl: "https://github.com/mlcommons/croissant/tree/main/python/mlcroissant",
        docsUrl: "https://huggingface.co/docs/dataset-viewer/mlcroissant"
      },
      webdataset: {
        prettyLabel: "WebDataset",
        repoName: "webdataset",
        repoUrl: "https://github.com/webdataset/webdataset",
        docsUrl: "https://huggingface.co/docs/hub/datasets-webdataset"
      },
      datasets: {
        prettyLabel: "Datasets",
        repoName: "datasets",
        repoUrl: "https://github.com/huggingface/datasets",
        docsUrl: "https://huggingface.co/docs/hub/datasets-usage"
      },
      pandas: {
        prettyLabel: "pandas",
        repoName: "pandas",
        repoUrl: "https://github.com/pandas-dev/pandas",
        docsUrl: "https://huggingface.co/docs/hub/datasets-pandas"
      },
      dask: {
        prettyLabel: "Dask",
        repoName: "dask",
        repoUrl: "https://github.com/dask/dask",
        docsUrl: "https://huggingface.co/docs/hub/datasets-dask"
      },
      distilabel: {
        prettyLabel: "Distilabel",
        repoName: "distilabel",
        repoUrl: "https://github.com/argilla-io/distilabel",
        docsUrl: "https://huggingface.co/docs/hub/datasets-distilabel"
      },
      fiftyone: {
        prettyLabel: "FiftyOne",
        repoName: "fiftyone",
        repoUrl: "https://github.com/voxel51/fiftyone",
        docsUrl: "https://huggingface.co/docs/hub/datasets-fiftyone"
      },
      argilla: {
        prettyLabel: "Argilla",
        repoName: "argilla",
        repoUrl: "https://github.com/argilla-io/argilla",
        docsUrl: "https://huggingface.co/docs/hub/datasets-argilla"
      },
      polars: {
        prettyLabel: "Polars",
        repoName: "polars",
        repoUrl: "https://github.com/pola-rs/polars",
        docsUrl: "https://huggingface.co/docs/hub/datasets-polars"
      },
      duckdb: {
        prettyLabel: "DuckDB",
        repoName: "duckdb",
        repoUrl: "https://github.com/duckdb/duckdb",
        docsUrl: "https://huggingface.co/docs/hub/datasets-duckdb"
      },
      datadesigner: {
        prettyLabel: "NeMo Data Designer",
        repoName: "datadesigner",
        repoUrl: "https://github.com/NVIDIA-NeMo/DataDesigner",
        docsUrl: "https://nvidia-nemo.github.io/DataDesigner/"
      }
    };
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/inference-providers.js
var require_inference_providers = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/inference-providers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HF_HUB_INFERENCE_PROXY_TEMPLATE = void 0;
    exports2.openAIbaseUrl = openAIbaseUrl;
    exports2.HF_HUB_INFERENCE_PROXY_TEMPLATE = `https://router.huggingface.co/{{PROVIDER}}`;
    function openAIbaseUrl(provider) {
      const url = exports2.HF_HUB_INFERENCE_PROXY_TEMPLATE.replace("{{PROVIDER}}", provider);
      return provider === "hf-inference" ? `${url}/v1` : url;
    }
  }
});

// node_modules/@huggingface/tasks/dist/commonjs/index.js
var require_commonjs = __commonJS({
  "node_modules/@huggingface/tasks/dist/commonjs/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DATASET_LIBRARIES_UI_ELEMENTS = exports2.LOCAL_APPS = exports2.DEFAULT_MEMORY_OPTIONS = exports2.SKUS = exports2.getModelInputSnippet = exports2.stringifyMessages = exports2.stringifyGenerationConfig = exports2.inferenceSnippetLanguages = exports2.SPECIAL_TOKENS_ATTRIBUTES = exports2.MODEL_LIBRARIES_UI_ELEMENTS = exports2.ALL_MODEL_LIBRARY_KEYS = exports2.ALL_DISPLAY_MODEL_LIBRARY_KEYS = exports2.PIPELINE_TYPES_SET = exports2.SUBTASK_TYPES = exports2.MODALITY_LABELS = exports2.MODALITIES = exports2.PIPELINE_TYPES = exports2.PIPELINE_DATA = exports2.MAPPING_DEFAULT_WIDGET = exports2.LIBRARY_TASK_MAPPING = void 0;
    var library_to_tasks_js_1 = require_library_to_tasks();
    Object.defineProperty(exports2, "LIBRARY_TASK_MAPPING", { enumerable: true, get: function() {
      return library_to_tasks_js_1.LIBRARY_TASK_MAPPING;
    } });
    var default_widget_inputs_js_1 = require_default_widget_inputs();
    Object.defineProperty(exports2, "MAPPING_DEFAULT_WIDGET", { enumerable: true, get: function() {
      return default_widget_inputs_js_1.MAPPING_DEFAULT_WIDGET;
    } });
    __exportStar(require_tasks2(), exports2);
    var pipelines_js_1 = require_pipelines();
    Object.defineProperty(exports2, "PIPELINE_DATA", { enumerable: true, get: function() {
      return pipelines_js_1.PIPELINE_DATA;
    } });
    Object.defineProperty(exports2, "PIPELINE_TYPES", { enumerable: true, get: function() {
      return pipelines_js_1.PIPELINE_TYPES;
    } });
    Object.defineProperty(exports2, "MODALITIES", { enumerable: true, get: function() {
      return pipelines_js_1.MODALITIES;
    } });
    Object.defineProperty(exports2, "MODALITY_LABELS", { enumerable: true, get: function() {
      return pipelines_js_1.MODALITY_LABELS;
    } });
    Object.defineProperty(exports2, "SUBTASK_TYPES", { enumerable: true, get: function() {
      return pipelines_js_1.SUBTASK_TYPES;
    } });
    Object.defineProperty(exports2, "PIPELINE_TYPES_SET", { enumerable: true, get: function() {
      return pipelines_js_1.PIPELINE_TYPES_SET;
    } });
    var model_libraries_js_1 = require_model_libraries();
    Object.defineProperty(exports2, "ALL_DISPLAY_MODEL_LIBRARY_KEYS", { enumerable: true, get: function() {
      return model_libraries_js_1.ALL_DISPLAY_MODEL_LIBRARY_KEYS;
    } });
    Object.defineProperty(exports2, "ALL_MODEL_LIBRARY_KEYS", { enumerable: true, get: function() {
      return model_libraries_js_1.ALL_MODEL_LIBRARY_KEYS;
    } });
    Object.defineProperty(exports2, "MODEL_LIBRARIES_UI_ELEMENTS", { enumerable: true, get: function() {
      return model_libraries_js_1.MODEL_LIBRARIES_UI_ELEMENTS;
    } });
    var tokenizer_data_js_1 = require_tokenizer_data();
    Object.defineProperty(exports2, "SPECIAL_TOKENS_ATTRIBUTES", { enumerable: true, get: function() {
      return tokenizer_data_js_1.SPECIAL_TOKENS_ATTRIBUTES;
    } });
    __exportStar(require_gguf(), exports2);
    var index_js_1 = require_snippets();
    Object.defineProperty(exports2, "inferenceSnippetLanguages", { enumerable: true, get: function() {
      return index_js_1.inferenceSnippetLanguages;
    } });
    Object.defineProperty(exports2, "stringifyGenerationConfig", { enumerable: true, get: function() {
      return index_js_1.stringifyGenerationConfig;
    } });
    Object.defineProperty(exports2, "stringifyMessages", { enumerable: true, get: function() {
      return index_js_1.stringifyMessages;
    } });
    Object.defineProperty(exports2, "getModelInputSnippet", { enumerable: true, get: function() {
      return index_js_1.getModelInputSnippet;
    } });
    var hardware_js_1 = require_hardware();
    Object.defineProperty(exports2, "SKUS", { enumerable: true, get: function() {
      return hardware_js_1.SKUS;
    } });
    Object.defineProperty(exports2, "DEFAULT_MEMORY_OPTIONS", { enumerable: true, get: function() {
      return hardware_js_1.DEFAULT_MEMORY_OPTIONS;
    } });
    var local_apps_js_1 = require_local_apps();
    Object.defineProperty(exports2, "LOCAL_APPS", { enumerable: true, get: function() {
      return local_apps_js_1.LOCAL_APPS;
    } });
    var dataset_libraries_js_1 = require_dataset_libraries();
    Object.defineProperty(exports2, "DATASET_LIBRARIES_UI_ELEMENTS", { enumerable: true, get: function() {
      return dataset_libraries_js_1.DATASET_LIBRARIES_UI_ELEMENTS;
    } });
    __exportStar(require_inference_providers(), exports2);
  }
});

// node_modules/@huggingface/inference/dist/commonjs/snippets/templates.exported.js
var require_templates_exported = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/snippets/templates.exported.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.templates = void 0;
    exports2.templates = {
      "js": {
        "fetch": {
          "basic": 'async function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "application/json",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n	const result = await response.json();\n	return result;\n}\n\nquery({ inputs: {{ providerInputs.asObj.inputs }} }).then((response) => {\n    console.log(JSON.stringify(response));\n});',
          "basicAudio": 'async function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "audio/flac",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n	const result = await response.json();\n	return result;\n}\n\nquery({ inputs: {{ providerInputs.asObj.inputs }} }).then((response) => {\n    console.log(JSON.stringify(response));\n});',
          "basicImage": 'async function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "image/jpeg",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n	const result = await response.json();\n	return result;\n}\n\nquery({ inputs: {{ providerInputs.asObj.inputs }} }).then((response) => {\n    console.log(JSON.stringify(response));\n});',
          "conversational": 'async function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "application/json",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n	const result = await response.json();\n	return result;\n}\n\nquery({ \n{{ autoInputs.asTsString }}\n}).then((response) => {\n    console.log(JSON.stringify(response));\n});',
          "imageToImage": 'const image = fs.readFileSync("{{inputs.asObj.inputs}}");\n\nasync function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "image/jpeg",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: {\n				"inputs": `data:image/png;base64,${data.inputs.encode("base64")}`,\n				"parameters": data.parameters,\n			}\n		}\n	);\n	const result = await response.json();\n	return result;\n}\n\nquery({ \n	inputs: image,\n	parameters: {\n		prompt: "{{ inputs.asObj.parameters.prompt }}",\n	}\n}).then((response) => {\n    console.log(JSON.stringify(response));\n});',
          "imageToVideo": 'const image = fs.readFileSync("{{inputs.asObj.inputs}}");\n\nasync function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "image/jpeg",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: {\n				"image_url": `data:image/png;base64,${data.image.encode("base64")}`,\n				"prompt": data.prompt,\n			}\n		}\n	);\n	const result = await response.json();\n	return result;\n}\n\nquery({\n	"image": image,\n	"prompt": "{{inputs.asObj.parameters.prompt}}",\n}).then((response) => {\n    // Use video\n});',
          "textToAudio": '{% if model.library_name == "transformers" %}\nasync function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "application/json",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n	const result = await response.blob();\n    return result;\n}\n\nquery({ inputs: {{ providerInputs.asObj.inputs }} }).then((response) => {\n    // Returns a byte object of the Audio wavform. Use it directly!\n});\n{% else %}\nasync function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "application/json",\n			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n    const result = await response.json();\n    return result;\n}\n\nquery({ inputs: {{ providerInputs.asObj.inputs }} }).then((response) => {\n    console.log(JSON.stringify(response));\n});\n{% endif %} ',
          "textToImage": 'async function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "application/json",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n	const result = await response.blob();\n	return result;\n}\n\n\nquery({ {{ providerInputs.asTsString }} }).then((response) => {\n    // Use image\n});',
          "textToSpeech": '{% if model.library_name == "transformers" %}\nasync function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "application/json",\n{% if billTo %}\n				"X-HF-Bill-To": "{{ billTo }}",\n{% endif %}			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n	const result = await response.blob();\n    return result;\n}\n\nquery({ text: {{ inputs.asObj.inputs }} }).then((response) => {\n    // Returns a byte object of the Audio wavform. Use it directly!\n});\n{% else %}\nasync function query(data) {\n	const response = await fetch(\n		"{{ fullUrl }}",\n		{\n			headers: {\n				Authorization: "{{ authorizationHeader }}",\n				"Content-Type": "application/json",\n			},\n			method: "POST",\n			body: JSON.stringify(data),\n		}\n	);\n    const result = await response.json();\n    return result;\n}\n\nquery({ text: {{ inputs.asObj.inputs }} }).then((response) => {\n    console.log(JSON.stringify(response));\n});\n{% endif %} ',
          "zeroShotClassification": 'async function query(data) {\n    const response = await fetch(\n		"{{ fullUrl }}",\n        {\n            headers: {\n				Authorization: "{{ authorizationHeader }}",\n                "Content-Type": "application/json",\n{% if billTo %}\n                "X-HF-Bill-To": "{{ billTo }}",\n{% endif %}         },\n            method: "POST",\n            body: JSON.stringify(data),\n        }\n    );\n    const result = await response.json();\n    return result;\n}\n\nquery({\n    inputs: {{ providerInputs.asObj.inputs }},\n    parameters: { candidate_labels: ["refund", "legal", "faq"] }\n}).then((response) => {\n    console.log(JSON.stringify(response));\n});'
        },
        "huggingface.js": {
          "basic": 'import { InferenceClient } from "@huggingface/inference";\n\nconst client = new InferenceClient("{{ accessToken }}");\n\nconst output = await client.{{ methodName }}({\n{% if endpointUrl %}\n    endpointUrl: "{{ endpointUrl }}",\n{% endif %}\n	model: "{{ model.id }}",\n	inputs: {{ inputs.asObj.inputs }},\n	provider: "{{ provider }}",\n}{% if billTo %}, {\n	billTo: "{{ billTo }}",\n}{% endif %});\n\nconsole.log(output);',
          "basicAudio": 'import { InferenceClient } from "@huggingface/inference";\n\nconst client = new InferenceClient("{{ accessToken }}");\n\nconst data = fs.readFileSync({{inputs.asObj.inputs}});\n\nconst output = await client.{{ methodName }}({\n{% if endpointUrl %}\n    endpointUrl: "{{ endpointUrl }}",\n{% endif %}\n	data,\n	model: "{{ model.id }}",\n	provider: "{{ provider }}",\n}{% if billTo %}, {\n	billTo: "{{ billTo }}",\n}{% endif %});\n\nconsole.log(output);',
          "basicImage": 'import { InferenceClient } from "@huggingface/inference";\n\nconst client = new InferenceClient("{{ accessToken }}");\n\nconst data = fs.readFileSync({{inputs.asObj.inputs}});\n\nconst output = await client.{{ methodName }}({\n{% if endpointUrl %}\n    endpointUrl: "{{ endpointUrl }}",\n{% endif %}\n	data,\n	model: "{{ model.id }}",\n	provider: "{{ provider }}",\n}{% if billTo %}, {\n	billTo: "{{ billTo }}",\n}{% endif %});\n\nconsole.log(output);',
          "conversational": 'import { InferenceClient } from "@huggingface/inference";\n\nconst client = new InferenceClient("{{ accessToken }}");\n\nconst chatCompletion = await client.chatCompletion({\n{% if endpointUrl %}\n    endpointUrl: "{{ endpointUrl }}",\n{% endif %}\n{% if directRequest %}\n    provider: "{{ provider }}",\n    model: "{{ model.id }}",\n{% else %}\n    model: "{{ providerModelId }}",\n{% endif %}\n{{ inputs.asTsString }}\n}{% if billTo %}, {\n    billTo: "{{ billTo }}",\n}{% endif %});\n\nconsole.log(chatCompletion.choices[0].message);',
          "conversationalStream": 'import { InferenceClient } from "@huggingface/inference";\n\nconst client = new InferenceClient("{{ accessToken }}");\n\nlet out = "";\n\nconst stream = client.chatCompletionStream({\n{% if endpointUrl %}\n    endpointUrl: "{{ endpointUrl }}",\n{% endif %}\n    model: "{{ providerModelId }}",\n{{ inputs.asTsString }}\n}{% if billTo %}, {\n    billTo: "{{ billTo }}",\n}{% endif %});\n\nfor await (const chunk of stream) {\n	if (chunk.choices && chunk.choices.length > 0) {\n		const newContent = chunk.choices[0].delta.content;\n		out += newContent;\n		console.log(newContent);\n	}\n}',
          "imageToImage": `import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("{{ accessToken }}");

const data = fs.readFileSync("{{inputs.asObj.inputs}}");

const image = await client.imageToImage({
{% if endpointUrl %}
	endpointUrl: "{{ endpointUrl }}",
{% endif %}
	provider: "{{provider}}",
	model: "{{model.id}}",
	inputs: data,
	parameters: { prompt: "{{inputs.asObj.parameters.prompt}}", },
}{% if billTo %}, {
	billTo: "{{ billTo }}",
}{% endif %});
/// Use the generated image (it's a Blob)
// For example, you can save it to a file or display it in an image element
`,
          "imageToVideo": `import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("{{ accessToken }}");

const data = fs.readFileSync("{{inputs.asObj.inputs}}");

const video = await client.imageToVideo({
{% if endpointUrl %}
	endpointUrl: "{{ endpointUrl }}",
{% endif %}
	provider: "{{provider}}",
	model: "{{model.id}}",
	inputs: data,
	parameters: { prompt: "{{inputs.asObj.parameters.prompt}}", },
}{% if billTo %}, {
	billTo: "{{ billTo }}",
}{% endif %});

/// Use the generated video (it's a Blob)
// For example, you can save it to a file or display it in a video element
`,
          "textToImage": `import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("{{ accessToken }}");

const image = await client.textToImage({
{% if endpointUrl %}
    endpointUrl: "{{ endpointUrl }}",
{% endif %}
    provider: "{{ provider }}",
    model: "{{ model.id }}",
	inputs: {{ inputs.asObj.inputs }},
	parameters: { num_inference_steps: 5 },
}{% if billTo %}, {
    billTo: "{{ billTo }}",
}{% endif %});
/// Use the generated image (it's a Blob)`,
          "textToSpeech": `import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("{{ accessToken }}");

const audio = await client.textToSpeech({
{% if endpointUrl %}
    endpointUrl: "{{ endpointUrl }}",
{% endif %}
    provider: "{{ provider }}",
    model: "{{ model.id }}",
	inputs: {{ inputs.asObj.inputs }},
}{% if billTo %}, {
    billTo: "{{ billTo }}",
}{% endif %});
// Use the generated audio (it's a Blob)`,
          "textToVideo": `import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("{{ accessToken }}");

const video = await client.textToVideo({
{% if endpointUrl %}
    endpointUrl: "{{ endpointUrl }}",
{% endif %}
    provider: "{{ provider }}",
    model: "{{ model.id }}",
	inputs: {{ inputs.asObj.inputs }},
}{% if billTo %}, {
    billTo: "{{ billTo }}",
}{% endif %});
// Use the generated video (it's a Blob)`
        },
        "openai": {
          "conversational": 'import { OpenAI } from "openai";\n\nconst client = new OpenAI({\n	baseURL: "{{ baseUrl }}",\n	apiKey: "{{ accessToken }}",\n{% if billTo %}\n	defaultHeaders: {\n		"X-HF-Bill-To": "{{ billTo }}" \n	}\n{% endif %}\n});\n\nconst chatCompletion = await client.chat.completions.create({\n	model: "{{ providerModelId }}",\n{{ inputs.asTsString }}\n});\n\nconsole.log(chatCompletion.choices[0].message);',
          "conversationalStream": 'import { OpenAI } from "openai";\n\nconst client = new OpenAI({\n	baseURL: "{{ baseUrl }}",\n	apiKey: "{{ accessToken }}",\n{% if billTo %}\n    defaultHeaders: {\n		"X-HF-Bill-To": "{{ billTo }}" \n	}\n{% endif %}\n});\n\nconst stream = await client.chat.completions.create({\n    model: "{{ providerModelId }}",\n{{ inputs.asTsString }}\n    stream: true,\n});\n\nfor await (const chunk of stream) {\n    process.stdout.write(chunk.choices[0]?.delta?.content || "");\n}'
        }
      },
      "python": {
        "fal_client": {
          "imageToImage": `{%if provider == "fal-ai" %}
import fal_client
import base64

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

with open("{{inputs.asObj.inputs}}", "rb") as image_file:
    image_base_64 = base64.b64encode(image_file.read()).decode('utf-8')

result = fal_client.subscribe(
    "fal-ai/flux-kontext/dev",
    arguments={
        "prompt": f"data:image/png;base64,{image_base_64}",
        "image_url": "{{ providerInputs.asObj.inputs }}",
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)
print(result)
{%endif%}
`,
          "imageToVideo": `{%if provider == "fal-ai" %}
import fal_client
import base64

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

with open("{{inputs.asObj.inputs}}", "rb") as image_file:
    image_base_64 = base64.b64encode(image_file.read()).decode('utf-8')

result = fal_client.subscribe(
    "{{model.id}}",
    arguments={
        "image_url": f"data:image/png;base64,{image_base_64}",
        "prompt": "{{inputs.asObj.parameters.prompt}}",
    },
    with_logs=True,
    on_queue_update=on_queue_update,
)
print(result)
{%endif%}
`,
          "textToImage": '{% if provider == "fal-ai" %}\nimport fal_client\n\n{% if providerInputs.asObj.loras is defined and providerInputs.asObj.loras != none %}\nresult = fal_client.subscribe(\n    "{{ providerModelId }}",\n    arguments={\n        "prompt": {{ inputs.asObj.inputs }},\n        "loras":{{ providerInputs.asObj.loras | tojson }},\n    },\n)\n{% else %}\nresult = fal_client.subscribe(\n    "{{ providerModelId }}",\n    arguments={\n        "prompt": {{ inputs.asObj.inputs }},\n    },\n)\n{% endif %} \nprint(result)\n{% endif %} '
        },
        "huggingface_hub": {
          "basic": 'result = client.{{ methodName }}(\n    {{ inputs.asObj.inputs }},\n    model="{{ model.id }}",\n)',
          "basicAudio": 'output = client.{{ methodName }}({{ inputs.asObj.inputs }}, model="{{ model.id }}")',
          "basicImage": 'output = client.{{ methodName }}({{ inputs.asObj.inputs }}, model="{{ model.id }}")',
          "conversational": 'completion = client.chat.completions.create(\n{% if directRequest %}\n    model="{{ model.id }}",\n{% else %}\n    model="{{ providerModelId }}",\n{% endif %}\n{{ inputs.asPythonString }}\n)\n\nprint(completion.choices[0].message) ',
          "conversationalStream": 'stream = client.chat.completions.create(\n    model="{{ providerModelId }}",\n{{ inputs.asPythonString }}\n    stream=True,\n)\n\nfor chunk in stream:\n    print(chunk.choices[0].delta.content, end="") ',
          "documentQuestionAnswering": 'output = client.document_question_answering(\n    "{{ inputs.asObj.image }}",\n    question="{{ inputs.asObj.question }}",\n    model="{{ model.id }}",\n) ',
          "imageToImage": 'with open("{{ inputs.asObj.inputs }}", "rb") as image_file:\n   input_image = image_file.read()\n\n# output is a PIL.Image object\nimage = client.image_to_image(\n    input_image,\n    prompt="{{ inputs.asObj.parameters.prompt }}",\n    model="{{ model.id }}",\n)\n',
          "imageToVideo": 'with open("{{ inputs.asObj.inputs }}", "rb") as image_file:\n   input_image = image_file.read()\n\nvideo = client.image_to_video(\n    input_image,\n    prompt="{{ inputs.asObj.parameters.prompt }}",\n    model="{{ model.id }}",\n) \n',
          "importInferenceClient": 'from huggingface_hub import InferenceClient\n\nclient = InferenceClient(\n{% if endpointUrl %}\n    base_url="{{ baseUrl }}",\n{% endif %}\n{% if task != "conversational" or directRequest %}\n    provider="{{ provider }}",\n{% endif %}\n    api_key="{{ accessToken }}",\n{% if billTo %}\n    bill_to="{{ billTo }}",\n{% endif %}\n)',
          "questionAnswering": 'answer = client.question_answering(\n    question="{{ inputs.asObj.question }}",\n    context="{{ inputs.asObj.context }}",\n    model="{{ model.id }}",\n) ',
          "tableQuestionAnswering": 'answer = client.table_question_answering(\n    query="{{ inputs.asObj.query }}",\n    table={{ inputs.asObj.table }},\n    model="{{ model.id }}",\n) ',
          "textToImage": '# output is a PIL.Image object\nimage = client.text_to_image(\n    {{ inputs.asObj.inputs }},\n    model="{{ model.id }}",\n) ',
          "textToSpeech": '# audio is returned as bytes\naudio = client.text_to_speech(\n    {{ inputs.asObj.inputs }},\n    model="{{ model.id }}",\n) \n',
          "textToVideo": 'video = client.text_to_video(\n    {{ inputs.asObj.inputs }},\n    model="{{ model.id }}",\n) '
        },
        "openai": {
          "conversational": 'from openai import OpenAI\n\nclient = OpenAI(\n    base_url="{{ baseUrl }}",\n    api_key="{{ accessToken }}",\n{% if billTo %}\n    default_headers={\n        "X-HF-Bill-To": "{{ billTo }}"\n    }\n{% endif %}\n)\n\ncompletion = client.chat.completions.create(\n    model="{{ providerModelId }}",\n{{ inputs.asPythonString }}\n)\n\nprint(completion.choices[0].message) ',
          "conversationalStream": 'from openai import OpenAI\n\nclient = OpenAI(\n    base_url="{{ baseUrl }}",\n    api_key="{{ accessToken }}",\n{% if billTo %}\n    default_headers={\n        "X-HF-Bill-To": "{{ billTo }}"\n    }\n{% endif %}\n)\n\nstream = client.chat.completions.create(\n    model="{{ providerModelId }}",\n{{ inputs.asPythonString }}\n    stream=True,\n)\n\nfor chunk in stream:\n    print(chunk.choices[0].delta.content, end="")'
        },
        "requests": {
          "basic": 'def query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.json()\n\noutput = query({\n    "inputs": {{ providerInputs.asObj.inputs }},\n}) ',
          "basicAudio": 'def query(filename):\n    with open(filename, "rb") as f:\n        data = f.read()\n    response = requests.post(API_URL, headers={"Content-Type": "audio/flac", **headers}, data=data)\n    return response.json()\n\noutput = query({{ providerInputs.asObj.inputs }})',
          "basicImage": 'def query(filename):\n    with open(filename, "rb") as f:\n        data = f.read()\n    response = requests.post(API_URL, headers={"Content-Type": "image/jpeg", **headers}, data=data)\n    return response.json()\n\noutput = query({{ providerInputs.asObj.inputs }})',
          "conversational": 'def query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.json()\n\nresponse = query({\n{{ autoInputs.asJsonString }}\n})\n\nprint(response["choices"][0]["message"])',
          "conversationalStream": 'def query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload, stream=True)\n    for line in response.iter_lines():\n        if not line.startswith(b"data:"):\n            continue\n        if line.strip() == b"data: [DONE]":\n            return\n        yield json.loads(line.decode("utf-8").lstrip("data:").rstrip("/n"))\n\nchunks = query({\n{{ autoInputs.asJsonString }},\n    "stream": True,\n})\n\nfor chunk in chunks:\n    print(chunk["choices"][0]["delta"]["content"], end="")',
          "documentQuestionAnswering": 'def query(payload):\n    with open(payload["image"], "rb") as f:\n        img = f.read()\n        payload["image"] = base64.b64encode(img).decode("utf-8")\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.json()\n\noutput = query({\n    "inputs": {\n        "image": "{{ inputs.asObj.image }}",\n        "question": "{{ inputs.asObj.question }}",\n    },\n}) ',
          "imageToImage": '\ndef query(payload):\n    with open(payload["inputs"], "rb") as f:\n        img = f.read()\n        payload["inputs"] = base64.b64encode(img).decode("utf-8")\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.content\n\nimage_bytes = query({\n{{ providerInputs.asJsonString }}\n})\n\n# You can access the image with PIL.Image for example\nimport io\nfrom PIL import Image\nimage = Image.open(io.BytesIO(image_bytes)) ',
          "imageToVideo": '\ndef query(payload):\n    with open(payload["inputs"], "rb") as f:\n        img = f.read()\n        payload["inputs"] = base64.b64encode(img).decode("utf-8")\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.content\n\nvideo_bytes = query({\n{{ inputs.asJsonString }}\n})\n',
          "importRequests": '{% if importBase64 %}\nimport base64\n{% endif %}\n{% if importJson %}\nimport json\n{% endif %}\nimport requests\n\nAPI_URL = "{{ fullUrl }}"\nheaders = {\n    "Authorization": "{{ authorizationHeader }}",\n{% if billTo %}\n    "X-HF-Bill-To": "{{ billTo }}"\n{% endif %}\n}',
          "tabular": 'def query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.content\n\nresponse = query({\n    "inputs": {\n        "data": {{ providerInputs.asObj.inputs }}\n    },\n}) ',
          "textToAudio": '{% if model.library_name == "transformers" %}\ndef query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.content\n\naudio_bytes = query({\n    "inputs": {{ inputs.asObj.inputs }},\n})\n# You can access the audio with IPython.display for example\nfrom IPython.display import Audio\nAudio(audio_bytes)\n{% else %}\ndef query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.json()\n\naudio, sampling_rate = query({\n    "inputs": {{ inputs.asObj.inputs }},\n})\n# You can access the audio with IPython.display for example\nfrom IPython.display import Audio\nAudio(audio, rate=sampling_rate)\n{% endif %} ',
          "textToImage": '{% if provider == "hf-inference" %}\ndef query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.content\n\nimage_bytes = query({\n    "inputs": {{ providerInputs.asObj.inputs }},\n})\n\n# You can access the image with PIL.Image for example\nimport io\nfrom PIL import Image\nimage = Image.open(io.BytesIO(image_bytes))\n{% endif %}',
          "textToSpeech": '{% if model.library_name == "transformers" %}\ndef query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.content\n\naudio_bytes = query({\n    "text": {{ inputs.asObj.inputs }},\n})\n# You can access the audio with IPython.display for example\nfrom IPython.display import Audio\nAudio(audio_bytes)\n{% else %}\ndef query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.json()\n\naudio, sampling_rate = query({\n    "text": {{ inputs.asObj.inputs }},\n})\n# You can access the audio with IPython.display for example\nfrom IPython.display import Audio\nAudio(audio, rate=sampling_rate)\n{% endif %} ',
          "zeroShotClassification": 'def query(payload):\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.json()\n\noutput = query({\n    "inputs": {{ providerInputs.asObj.inputs }},\n    "parameters": {"candidate_labels": ["refund", "legal", "faq"]},\n}) ',
          "zeroShotImageClassification": 'def query(data):\n    with open(data["image_path"], "rb") as f:\n        img = f.read()\n    payload={\n        "parameters": data["parameters"],\n        "inputs": base64.b64encode(img).decode("utf-8")\n    }\n    response = requests.post(API_URL, headers=headers, json=payload)\n    return response.json()\n\noutput = query({\n    "image_path": {{ providerInputs.asObj.inputs }},\n    "parameters": {"candidate_labels": ["cat", "dog", "llama"]},\n}) '
        }
      },
      "sh": {
        "curl": {
          "basic": "curl {{ fullUrl }} \\\n    -X POST \\\n    -H 'Authorization: {{ authorizationHeader }}' \\\n    -H 'Content-Type: application/json' \\\n{% if billTo %}\n    -H 'X-HF-Bill-To: {{ billTo }}' \\\n{% endif %}\n    -d '{\n{{ providerInputs.asCurlString }}\n    }'",
          "basicAudio": "curl {{ fullUrl }} \\\n    -X POST \\\n    -H 'Authorization: {{ authorizationHeader }}' \\\n    -H 'Content-Type: audio/flac' \\\n{% if billTo %}\n    -H 'X-HF-Bill-To: {{ billTo }}' \\\n{% endif %}\n    --data-binary @{{ providerInputs.asObj.inputs }}",
          "basicImage": "curl {{ fullUrl }} \\\n    -X POST \\\n    -H 'Authorization: {{ authorizationHeader }}' \\\n    -H 'Content-Type: image/jpeg' \\\n{% if billTo %}\n    -H 'X-HF-Bill-To: {{ billTo }}' \\\n{% endif %}\n    --data-binary @{{ providerInputs.asObj.inputs }}",
          "conversational": `curl {{ fullUrl }} \\
    -H 'Authorization: {{ authorizationHeader }}' \\
    -H 'Content-Type: application/json' \\
{% if billTo %}
    -H 'X-HF-Bill-To: {{ billTo }}' \\
{% endif %}
    -d '{
{{ autoInputs.asCurlString }},
        "stream": false
    }'`,
          "conversationalStream": `curl {{ fullUrl }} \\
    -H 'Authorization: {{ authorizationHeader }}' \\
    -H 'Content-Type: application/json' \\
{% if billTo %}
    -H 'X-HF-Bill-To: {{ billTo }}' \\
{% endif %}
    -d '{
{{ autoInputs.asCurlString }},
        "stream": true
    }'`,
          "zeroShotClassification": `curl {{ fullUrl }} \\
    -X POST \\
    -d '{"inputs": {{ providerInputs.asObj.inputs }}, "parameters": {"candidate_labels": ["refund", "legal", "faq"]}}' \\
    -H 'Content-Type: application/json' \\
    -H 'Authorization: {{ authorizationHeader }}'
{% if billTo %} \\
    -H 'X-HF-Bill-To: {{ billTo }}'
{% endif %}`
        }
      }
    };
  }
});

// node_modules/@huggingface/inference/dist/commonjs/snippets/getInferenceSnippets.js
var require_getInferenceSnippets = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/snippets/getInferenceSnippets.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getInferenceSnippets = getInferenceSnippets;
    var jinja_1 = require_dist();
    var tasks_1 = require_commonjs();
    var getProviderHelper_js_1 = require_getProviderHelper();
    var makeRequestOptions_js_1 = require_makeRequestOptions();
    var templates_exported_js_1 = require_templates_exported();
    var logger_js_1 = require_logger();
    var config_js_1 = require_config();
    var PYTHON_CLIENTS = ["openai", "huggingface_hub", "fal_client", "requests"];
    var JS_CLIENTS = ["openai", "huggingface.js", "fetch"];
    var SH_CLIENTS = ["curl"];
    var CLIENTS = {
      js: [...JS_CLIENTS],
      python: [...PYTHON_CLIENTS],
      sh: [...SH_CLIENTS]
    };
    var CLIENTS_NON_CONVERSATIONAL_AUTO_POLICY = {
      js: ["huggingface.js"],
      python: ["huggingface_hub"]
    };
    var hasTemplate = (language, client, templateName) => templates_exported_js_1.templates[language]?.[client]?.[templateName] !== void 0;
    var loadTemplate = (language, client, templateName) => {
      const template = templates_exported_js_1.templates[language]?.[client]?.[templateName];
      if (!template) {
        throw new Error(`Template not found: ${language}/${client}/${templateName}`);
      }
      return (data) => new jinja_1.Template(template).render({ ...data });
    };
    var snippetImportPythonInferenceClient = loadTemplate("python", "huggingface_hub", "importInferenceClient");
    var snippetImportRequests = loadTemplate("python", "requests", "importRequests");
    var HF_PYTHON_METHODS = {
      "audio-classification": "audio_classification",
      "audio-to-audio": "audio_to_audio",
      "automatic-speech-recognition": "automatic_speech_recognition",
      "document-question-answering": "document_question_answering",
      "feature-extraction": "feature_extraction",
      "fill-mask": "fill_mask",
      "image-classification": "image_classification",
      "image-segmentation": "image_segmentation",
      "image-to-image": "image_to_image",
      "image-to-video": "image_to_video",
      "image-to-text": "image_to_text",
      "image-text-to-image": "image_text_to_image",
      "image-text-to-video": "image_text_to_video",
      "object-detection": "object_detection",
      "question-answering": "question_answering",
      "sentence-similarity": "sentence_similarity",
      summarization: "summarization",
      "table-question-answering": "table_question_answering",
      "tabular-classification": "tabular_classification",
      "tabular-regression": "tabular_regression",
      "text-classification": "text_classification",
      "text-generation": "text_generation",
      "text-to-image": "text_to_image",
      "text-to-speech": "text_to_speech",
      "text-to-video": "text_to_video",
      "token-classification": "token_classification",
      translation: "translation",
      "visual-question-answering": "visual_question_answering",
      "zero-shot-classification": "zero_shot_classification",
      "zero-shot-image-classification": "zero_shot_image_classification"
    };
    var HF_JS_METHODS = {
      "automatic-speech-recognition": "automaticSpeechRecognition",
      "feature-extraction": "featureExtraction",
      "fill-mask": "fillMask",
      "image-classification": "imageClassification",
      "question-answering": "questionAnswering",
      "sentence-similarity": "sentenceSimilarity",
      summarization: "summarization",
      "table-question-answering": "tableQuestionAnswering",
      "text-classification": "textClassification",
      "text-generation": "textGeneration",
      "token-classification": "tokenClassification",
      "text-to-speech": "textToSpeech",
      translation: "translation"
    };
    var ACCESS_TOKEN_ROUTING_PLACEHOLDER = "hf_token_placeholder";
    var ACCESS_TOKEN_DIRECT_REQUEST_PLACEHOLDER = "not_hf_token_placeholder";
    var snippetGenerator = (templateName, inputPreparationFn) => {
      return (model, provider, inferenceProviderMapping, opts) => {
        const logger = (0, logger_js_1.getLogger)();
        const providerModelId = inferenceProviderMapping?.providerId ?? model.id;
        let task = model.pipeline_tag;
        if (model.pipeline_tag && ["text-generation", "image-text-to-text"].includes(model.pipeline_tag) && model.tags.includes("conversational")) {
          templateName = opts?.streaming ? "conversationalStream" : "conversational";
          inputPreparationFn = prepareConversationalInput;
          task = "conversational";
        }
        let providerHelper;
        try {
          providerHelper = (0, getProviderHelper_js_1.getProviderHelper)(provider, task);
        } catch (e) {
          logger.error(`Failed to get provider helper for ${provider} (${task})`, e);
          return [];
        }
        const placeholder = opts?.directRequest ? ACCESS_TOKEN_DIRECT_REQUEST_PLACEHOLDER : ACCESS_TOKEN_ROUTING_PLACEHOLDER;
        const accessTokenOrPlaceholder = opts?.accessToken ?? placeholder;
        const inputs = opts?.inputs ? { inputs: opts.inputs } : inputPreparationFn ? inputPreparationFn(model, opts) : { inputs: (0, tasks_1.getModelInputSnippet)(model) };
        const request = (0, makeRequestOptions_js_1.makeRequestOptionsFromResolvedModel)(providerModelId, providerHelper, {
          accessToken: accessTokenOrPlaceholder,
          provider,
          endpointUrl: opts?.endpointUrl ?? (provider === "auto" ? config_js_1.HF_ROUTER_AUTO_ENDPOINT : void 0),
          ...inputs
        }, inferenceProviderMapping, {
          task,
          billTo: opts?.billTo
        });
        let providerInputs = inputs;
        const bodyAsObj = request.info.body;
        if (typeof bodyAsObj === "string") {
          try {
            providerInputs = JSON.parse(bodyAsObj);
          } catch (e) {
            logger.error("Failed to parse body as JSON", e);
          }
        }
        const autoInputs = !opts?.endpointUrl && !opts?.directRequest ? provider !== "auto" ? {
          ...inputs,
          model: `${model.id}:${provider}`
        } : {
          ...inputs,
          model: `${model.id}`
          // if no :provider => auto
        } : providerInputs;
        const params = {
          accessToken: accessTokenOrPlaceholder,
          authorizationHeader: request.info.headers?.Authorization,
          baseUrl: task === "conversational" && !opts?.endpointUrl && !opts?.directRequest ? config_js_1.HF_ROUTER_AUTO_ENDPOINT : removeSuffix(request.url, "/chat/completions"),
          fullUrl: task === "conversational" && !opts?.endpointUrl && !opts?.directRequest ? config_js_1.HF_ROUTER_AUTO_ENDPOINT + "/chat/completions" : request.url,
          inputs: {
            asObj: inputs,
            asCurlString: formatBody(inputs, "curl"),
            asJsonString: formatBody(inputs, "json"),
            asPythonString: formatBody(inputs, "python"),
            asTsString: formatBody(inputs, "ts")
          },
          providerInputs: {
            asObj: providerInputs,
            asCurlString: formatBody(providerInputs, "curl"),
            asJsonString: formatBody(providerInputs, "json"),
            asPythonString: formatBody(providerInputs, "python"),
            asTsString: formatBody(providerInputs, "ts")
          },
          autoInputs: {
            asObj: autoInputs,
            asCurlString: formatBody(autoInputs, "curl"),
            asJsonString: formatBody(autoInputs, "json"),
            asPythonString: formatBody(autoInputs, "python"),
            asTsString: formatBody(autoInputs, "ts")
          },
          model,
          provider,
          providerModelId: task === "conversational" && !opts?.endpointUrl && !opts?.directRequest ? provider !== "auto" ? `${model.id}:${provider}` : model.id : providerModelId ?? model.id,
          billTo: opts?.billTo,
          endpointUrl: opts?.endpointUrl,
          task,
          directRequest: !!opts?.directRequest
        };
        const clients = provider === "auto" && task !== "conversational" ? CLIENTS_NON_CONVERSATIONAL_AUTO_POLICY : CLIENTS;
        return tasks_1.inferenceSnippetLanguages.map((language) => {
          const langClients = clients[language] ?? [];
          return langClients.map((client) => {
            if (!hasTemplate(language, client, templateName)) {
              return;
            }
            const template = loadTemplate(language, client, templateName);
            if (client === "huggingface_hub" && templateName.includes("basic")) {
              if (!(model.pipeline_tag && model.pipeline_tag in HF_PYTHON_METHODS)) {
                return;
              }
              params["methodName"] = HF_PYTHON_METHODS[model.pipeline_tag];
            }
            if (client === "huggingface.js" && templateName.includes("basic")) {
              if (!(model.pipeline_tag && model.pipeline_tag in HF_JS_METHODS)) {
                return;
              }
              params["methodName"] = HF_JS_METHODS[model.pipeline_tag];
            }
            let snippet = template(params).trim();
            if (!snippet) {
              return;
            }
            if (client === "huggingface_hub") {
              const importSection = snippetImportPythonInferenceClient({ ...params });
              snippet = `${importSection}

${snippet}`;
            } else if (client === "requests") {
              const importSection = snippetImportRequests({
                ...params,
                importBase64: snippet.includes("base64"),
                importJson: snippet.includes("json.")
              });
              snippet = `${importSection}

${snippet}`;
            }
            if (snippet.includes(placeholder)) {
              snippet = replaceAccessTokenPlaceholder(opts?.directRequest, placeholder, snippet, language, provider, opts?.endpointUrl);
            }
            return { language, client, content: snippet };
          }).filter((snippet) => snippet !== void 0);
        }).flat();
      };
    };
    var prepareDocumentQuestionAnsweringInput = (model) => {
      return JSON.parse((0, tasks_1.getModelInputSnippet)(model));
    };
    var prepareImageToImageInput = (model) => {
      const data = JSON.parse((0, tasks_1.getModelInputSnippet)(model));
      return { inputs: data.image, parameters: { prompt: data.prompt } };
    };
    var prepareConversationalInput = (model, opts) => {
      return {
        messages: opts?.messages ?? (0, tasks_1.getModelInputSnippet)(model),
        ...opts?.temperature ? { temperature: opts?.temperature } : void 0,
        ...opts?.max_tokens ? { max_tokens: opts?.max_tokens } : void 0,
        ...opts?.top_p ? { top_p: opts?.top_p } : void 0
      };
    };
    var prepareQuestionAnsweringInput = (model) => {
      const data = JSON.parse((0, tasks_1.getModelInputSnippet)(model));
      return { question: data.question, context: data.context };
    };
    var prepareTableQuestionAnsweringInput = (model) => {
      const data = JSON.parse((0, tasks_1.getModelInputSnippet)(model));
      return { query: data.query, table: JSON.stringify(data.table) };
    };
    var snippets = {
      "audio-classification": snippetGenerator("basicAudio"),
      "audio-to-audio": snippetGenerator("basicAudio"),
      "automatic-speech-recognition": snippetGenerator("basicAudio"),
      "document-question-answering": snippetGenerator("documentQuestionAnswering", prepareDocumentQuestionAnsweringInput),
      "feature-extraction": snippetGenerator("basic"),
      "fill-mask": snippetGenerator("basic"),
      "image-classification": snippetGenerator("basicImage"),
      "image-segmentation": snippetGenerator("basicImage"),
      "image-text-to-image": snippetGenerator("imageToImage", prepareImageToImageInput),
      "image-text-to-text": snippetGenerator("conversational"),
      "image-text-to-video": snippetGenerator("imageToVideo", prepareImageToImageInput),
      "image-to-image": snippetGenerator("imageToImage", prepareImageToImageInput),
      "image-to-text": snippetGenerator("basicImage"),
      "image-to-video": snippetGenerator("imageToVideo", prepareImageToImageInput),
      "object-detection": snippetGenerator("basicImage"),
      "question-answering": snippetGenerator("questionAnswering", prepareQuestionAnsweringInput),
      "sentence-similarity": snippetGenerator("basic"),
      summarization: snippetGenerator("basic"),
      "tabular-classification": snippetGenerator("tabular"),
      "tabular-regression": snippetGenerator("tabular"),
      "table-question-answering": snippetGenerator("tableQuestionAnswering", prepareTableQuestionAnsweringInput),
      "text-classification": snippetGenerator("basic"),
      "text-generation": snippetGenerator("basic"),
      "text-to-audio": snippetGenerator("textToAudio"),
      "text-to-image": snippetGenerator("textToImage"),
      "text-to-speech": snippetGenerator("textToSpeech"),
      "text-to-video": snippetGenerator("textToVideo"),
      "token-classification": snippetGenerator("basic"),
      translation: snippetGenerator("basic"),
      "zero-shot-classification": snippetGenerator("zeroShotClassification"),
      "zero-shot-image-classification": snippetGenerator("zeroShotImageClassification")
    };
    function getInferenceSnippets(model, provider, inferenceProviderMapping, opts) {
      return model.pipeline_tag && model.pipeline_tag in snippets ? snippets[model.pipeline_tag]?.(model, provider, inferenceProviderMapping, opts) ?? [] : [];
    }
    function formatBody(obj, format) {
      switch (format) {
        case "curl":
          return indentString(formatBody(obj, "json"));
        case "json":
          return JSON.stringify(obj, null, 4).split("\n").slice(1, -1).join("\n");
        case "python":
          return indentString(Object.entries(obj).map(([key, value]) => {
            const formattedValue = JSON.stringify(value, null, 4).replace(/"/g, '"');
            return `${key}=${formattedValue},`;
          }).join("\n"));
        case "ts":
          return formatTsObject(obj).split("\n").slice(1, -1).join("\n");
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    }
    function formatTsObject(obj, depth) {
      depth = depth ?? 0;
      if (typeof obj !== "object" || obj === null) {
        return JSON.stringify(obj);
      }
      if (Array.isArray(obj)) {
        const items = obj.map((item) => {
          const formatted = formatTsObject(item, depth + 1);
          return `${" ".repeat(4 * (depth + 1))}${formatted},`;
        }).join("\n");
        return `[
${items}
${" ".repeat(4 * depth)}]`;
      }
      const entries = Object.entries(obj);
      const lines = entries.map(([key, value]) => {
        const formattedValue = formatTsObject(value, depth + 1);
        const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${" ".repeat(4 * (depth + 1))}${keyStr}: ${formattedValue},`;
      }).join("\n");
      return `{
${lines}
${" ".repeat(4 * depth)}}`;
    }
    function indentString(str) {
      return str.split("\n").map((line) => " ".repeat(4) + line).join("\n");
    }
    function removeSuffix(str, suffix) {
      return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str;
    }
    function replaceAccessTokenPlaceholder(directRequest, placeholder, snippet, language, provider, endpointUrl) {
      const useHfToken = !endpointUrl && // custom endpointUrl => use a generic API_TOKEN
      (provider == "hf-inference" || // hf-inference provider => use $HF_TOKEN
      !directRequest && // if explicit directRequest => use provider-specific token
      (snippet.includes("InferenceClient") || // using a client => use $HF_TOKEN
      snippet.includes("https://router.huggingface.co")));
      const accessTokenEnvVar = useHfToken ? "HF_TOKEN" : endpointUrl ? "API_TOKEN" : provider.toUpperCase().replace("-", "_") + "_API_KEY";
      if (language === "sh") {
        snippet = snippet.replace(
          `'Authorization: Bearer ${placeholder}'`,
          `"Authorization: Bearer $${accessTokenEnvVar}"`
          // e.g. "Authorization: Bearer $HF_TOKEN"
        );
      } else if (language === "python") {
        snippet = "import os\n" + snippet;
        snippet = snippet.replace(
          `"${placeholder}"`,
          `os.environ["${accessTokenEnvVar}"]`
          // e.g. os.environ["HF_TOKEN")
        );
        snippet = snippet.replace(
          `"Bearer ${placeholder}"`,
          `f"Bearer {os.environ['${accessTokenEnvVar}']}"`
          // e.g. f"Bearer {os.environ['HF_TOKEN']}"
        );
        snippet = snippet.replace(
          `"Key ${placeholder}"`,
          `f"Key {os.environ['${accessTokenEnvVar}']}"`
          // e.g. f"Key {os.environ['FAL_AI_API_KEY']}"
        );
        snippet = snippet.replace(
          `"X-Key ${placeholder}"`,
          `f"X-Key {os.environ['${accessTokenEnvVar}']}"`
          // e.g. f"X-Key {os.environ['BLACK_FOREST_LABS_API_KEY']}"
        );
      } else if (language === "js") {
        snippet = snippet.replace(
          `"${placeholder}"`,
          `process.env.${accessTokenEnvVar}`
          // e.g. process.env.HF_TOKEN
        );
        snippet = snippet.replace(
          `Authorization: "Bearer ${placeholder}",`,
          `Authorization: \`Bearer \${process.env.${accessTokenEnvVar}}\`,`
          // e.g. Authorization: `Bearer ${process.env.HF_TOKEN}`,
        );
        snippet = snippet.replace(
          `Authorization: "Key ${placeholder}",`,
          `Authorization: \`Key \${process.env.${accessTokenEnvVar}}\`,`
          // e.g. Authorization: `Key ${process.env.FAL_AI_API_KEY}`,
        );
        snippet = snippet.replace(
          `Authorization: "X-Key ${placeholder}",`,
          `Authorization: \`X-Key \${process.env.${accessTokenEnvVar}}\`,`
          // e.g. Authorization: `X-Key ${process.env.BLACK_FOREST_LABS_AI_API_KEY}`,
        );
      }
      return snippet;
    }
  }
});

// node_modules/@huggingface/inference/dist/commonjs/snippets/index.js
var require_snippets2 = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/snippets/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getInferenceSnippets = void 0;
    var getInferenceSnippets_js_1 = require_getInferenceSnippets();
    Object.defineProperty(exports2, "getInferenceSnippets", { enumerable: true, get: function() {
      return getInferenceSnippets_js_1.getInferenceSnippets;
    } });
  }
});

// node_modules/@huggingface/inference/dist/commonjs/index.js
var require_commonjs2 = __commonJS({
  "node_modules/@huggingface/inference/dist/commonjs/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.snippets = exports2.setLogger = exports2.HfInference = exports2.InferenceClientEndpoint = exports2.InferenceClient = void 0;
    var InferenceClient_js_1 = require_InferenceClient();
    Object.defineProperty(exports2, "InferenceClient", { enumerable: true, get: function() {
      return InferenceClient_js_1.InferenceClient;
    } });
    Object.defineProperty(exports2, "InferenceClientEndpoint", { enumerable: true, get: function() {
      return InferenceClient_js_1.InferenceClientEndpoint;
    } });
    Object.defineProperty(exports2, "HfInference", { enumerable: true, get: function() {
      return InferenceClient_js_1.HfInference;
    } });
    __exportStar(require_errors(), exports2);
    __exportStar(require_types(), exports2);
    __exportStar(require_tasks(), exports2);
    var snippets = __importStar(require_snippets2());
    exports2.snippets = snippets;
    __exportStar(require_getProviderHelper(), exports2);
    __exportStar(require_makeRequestOptions(), exports2);
    var logger_js_1 = require_logger();
    Object.defineProperty(exports2, "setLogger", { enumerable: true, get: function() {
      return logger_js_1.setLogger;
    } });
  }
});

// netlify/functions/huggingface-image.cjs
var { HfInference } = require_commonjs2();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    const { prompt, action = "generate", base64Image, model = "stabilityai/stable-diffusion-xl-base-1.0" } = JSON.parse(event.body);
    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Prompt is required" })
      };
    }
    console.log(`HuggingFace: ${action} image with model ${model}`);
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    let blob;
    if (action === "generate") {
      const enhancedPrompt = `${prompt}, photorealistic, 8k resolution, highly detailed, professional photography, sharp focus, vivid colors`;
      blob = await hf.textToImage({
        model,
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt: "blurry, bad quality, distorted, ugly, watermark, text, cartoon, 3d render",
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      });
    } else if (action === "remix") {
      if (!base64Image) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "base64Image is required for remix" })
        };
      }
      const base64Data = base64Image.split(",")[1] || base64Image;
      const imageBuffer = Buffer.from(base64Data, "base64");
      blob = await hf.imageToImage({
        model: "stabilityai/stable-diffusion-xl-refiner-1.0",
        inputs: {
          image: imageBuffer,
          prompt: `${prompt}, professional quality, cinematic lighting, realistic, high detail`
        },
        parameters: {
          strength: 0.7,
          guidance_scale: 7.5
        }
      });
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action. Use "generate" or "remix"' })
      };
    }
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;
    console.log("HuggingFace: Image generated successfully");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        image: dataUrl,
        model
      })
    };
  } catch (error) {
    console.error("HuggingFace API Error:", error);
    if (error.message && error.message.includes("Model is currently loading")) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          error: "Model is loading, please try again in 10-20 seconds",
          details: error.message
        })
      };
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to generate image",
        details: error.message
      })
    };
  }
};
//# sourceMappingURL=huggingface-image.js.map
