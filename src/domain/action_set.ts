export type Action = Record<string, string>;

export interface ActionSet {
    _id: string;
    name: string;
    actions: Action[];
}
