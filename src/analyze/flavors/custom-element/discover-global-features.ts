import { Node } from "typescript";
import { AnalyzerVisitContext } from "../../analyzer-visit-context";
import { isHTMLElementExtensionInterface } from "../../util/ast-util";
import { getJsDoc } from "../../util/js-doc-util";
import { resolveNodeValue } from "../../util/resolve-node-value";
import { AnalyzerFlavor, ComponentMemberResult } from "../analyzer-flavor";

export const discoverGlobalFeatures: AnalyzerFlavor["discoverGlobalFeatures"] = {
	member: (node: Node, context: AnalyzerVisitContext): ComponentMemberResult[] | undefined => {
		const { ts } = context;

		if (isHTMLElementExtensionInterface(node, context)) {
			const members: ComponentMemberResult[] = [];

			for (const member of node.members) {
				if (ts.isPropertySignature(member)) {
					const name = resolveNodeValue(member.name, context)?.value;

					if (name != null) {
						members.push({
							priority: "medium",
							member: {
								node: member,
								jsDoc: getJsDoc(member, ts),
								kind: "property",
								propName: name,
								type: () => context.checker.getTypeAtLocation(member)
							}
						});
					}
				}
			}

			context?.emitContinue?.();

			return members;
		}
	}
};
