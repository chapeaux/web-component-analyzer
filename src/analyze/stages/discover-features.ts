import { Node } from "typescript";
import { AnalyzerDeclarationVisitContext, ComponentFeatureCollection } from "../flavors/analyzer-flavor";
import { prepareRefineEmitMap } from "../util/get-refine-emit-map";
import { refineFeature } from "./flavor/refine-feature";
import { visitFeatures } from "./flavor/visit-features";
import { mergeFeatures } from "./merge/merge-features";

export function discoverFeatures(node: Node, context: AnalyzerDeclarationVisitContext): ComponentFeatureCollection {
	if (context.cache.featureCollection.has(node)) {
		return context.cache.featureCollection.get(node)!;
	}

	const { collection, refineEmitMap } = prepareRefineEmitMap();

	visitFeatures(node, context, {
		event: event => refineFeature("event", event, context, refineEmitMap),
		member: memberResult => refineFeature("member", memberResult, context, refineEmitMap),
		csspart: cssPart => refineFeature("csspart", cssPart, context, refineEmitMap),
		cssproperty: cssProperty => refineFeature("cssproperty", cssProperty, context, refineEmitMap),
		method: method => refineFeature("method", method, context, refineEmitMap),
		slot: slot => refineFeature("slot", slot, context, refineEmitMap)
	});

	const mergedCollection = mergeFeatures(collection, context);

	context.cache.featureCollection.set(node, mergedCollection);

	return mergedCollection;
}
