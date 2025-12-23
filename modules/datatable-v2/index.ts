import { ApiPayloadBuilder } from "./builders/ApiPayloadBuilder";
import type {
  PayloadBuilderFunction,
  ServerFetchParams,
} from "./types/ApiPayloadBuilder.types";

export { ApiPayloadBuilder };
export * from "./types/ApiPayloadBuilder.types";

const builder = new ApiPayloadBuilder();

export const defaultPayloadBuilder: PayloadBuilderFunction = (
  params: ServerFetchParams
) => {
  return builder.buildDefault(params);
};

export const lomkitPayloadBuilder: PayloadBuilderFunction = (
  params: ServerFetchParams
) => {
  return builder.buildLomkitPayload(params);
};

export const graphqlPayloadBuilder: PayloadBuilderFunction = (
  params: ServerFetchParams
) => {
  return builder.buildGraphQLPayload(params);
};

export function createCustomPayloadBuilder(
  builderFn: PayloadBuilderFunction
): PayloadBuilderFunction {
  return builderFn;
}
