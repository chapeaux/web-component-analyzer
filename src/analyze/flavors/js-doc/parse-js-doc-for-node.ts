import { JSDocTag, Node } from "typescript";
import { arrayDefined } from "../../../util/array-util";
import { JsDocTagParsed } from "../../types/js-doc";
import { getJsDoc } from "../../util/js-doc-util";
import { AnalyzerVisitContext } from "../../analyzer-visit-context";

export function parseJsDocForNode<T>(
	node: Node,
	tagNames: string[],
	transform: (tagNode: JSDocTag | undefined, parsed: JsDocTagParsed) => T | undefined,
	context: AnalyzerVisitContext
): T[] | undefined {
	const { tags } = getJsDoc(node, tagNames, context.ts) || {};

	if (tags != null && tags.length > 0) {
		context.emitContinue?.();
		return arrayDefined(tags.map(tag => transform(tag.node, tag.parsed())));
	}

	return undefined;
}
