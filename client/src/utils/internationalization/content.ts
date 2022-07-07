import { t } from "i18next";
import { ESMap } from "typescript";

interface TranslationNode {
    traverse: (x: string) => TranslationNode,
    getWholeKey: () => string,
    getThisKey: () => string,

    children: Array<TranslationNode>,
};

interface RootNode extends TranslationNode {
};
interface Node extends TranslationNode {
    key: string,

    parent: TranslationNode
} 

const traverse = (key: string): TranslationNode => {
    return undefined;
}

const constructRootNode = (): TranslationNode => {
    const newRoot: TranslationNode = {
        traverse: traverse,
        getWholeKey: () => '',
        getThisKey: () => '',

        children: new Array<TranslationNode>()
    }
    return newRoot;
}

const constructNode = (key: string, parent: Node): Node => {
    const node: Node = {
       traverse: traverse,
       getWholeKey: function(): string { return ''; },
       getThisKey: () => '',

       parent: parent,
       key: key,
       children: new Array<TranslationNode>()
    };
    return node;
}
const BIOMECH_MAIN_PAGE = 'biomech.main_page';
const biomech = {
    main: {
       getPriorityCol: t(`${BIOMECH_MAIN_PAGE}.priority_col`),
       getAuthorCol: t(`${BIOMECH_MAIN_PAGE}.author_col`),
       getCreatedCol: t(`${BIOMECH_MAIN_PAGE}.created_col`),
       getOptionsCol: t(`${BIOMECH_MAIN_PAGE}.options_col`)
    },
    
}
const Content = {};
export default Content;