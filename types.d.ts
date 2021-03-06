/// <reference types="react" />
import { ComponentClass, StatelessComponent } from 'react';
import ApolloClient, { MutationQueryReducersMap, ApolloQueryResult, ApolloError, FetchPolicy, FetchMoreOptions, UpdateQueryOptions, FetchMoreQueryOptions, SubscribeToMoreOptions, PureQueryOptions, MutationUpdaterFn } from 'apollo-client';
export interface MutationOpts<TVariables = OperationVariables> {
    variables?: TVariables;
    optimisticResponse?: Object;
    updateQueries?: MutationQueryReducersMap;
    refetchQueries?: string[] | PureQueryOptions[];
    update?: MutationUpdaterFn;
    client?: ApolloClient<any>;
    notifyOnNetworkStatusChange?: boolean;
}
export interface QueryOpts<TVariables = OperationVariables> {
    ssr?: boolean;
    variables?: TVariables;
    fetchPolicy?: FetchPolicy;
    pollInterval?: number;
    client?: ApolloClient<any>;
    notifyOnNetworkStatusChange?: boolean;
    skip?: boolean;
}
export interface QueryProps<TVariables = OperationVariables> {
    error?: ApolloError;
    networkStatus: number;
    loading: boolean;
    variables: TVariables;
    fetchMore: (fetchMoreOptions: FetchMoreQueryOptions & FetchMoreOptions) => Promise<ApolloQueryResult<any>>;
    refetch: (variables?: TVariables) => Promise<ApolloQueryResult<any>>;
    startPolling: (pollInterval: number) => void;
    stopPolling: () => void;
    subscribeToMore: (options: SubscribeToMoreOptions) => () => void;
    updateQuery: (mapFn: (previousQueryResult: any, options: UpdateQueryOptions) => any) => void;
}
export declare type MutationFunc<TResult, TVariables = OperationVariables> = (opts: MutationOpts<TVariables>) => Promise<ApolloQueryResult<TResult>>;
export interface OptionProps<TProps, TResult> {
    ownProps: TProps;
    data?: QueryProps & TResult;
    mutate?: MutationFunc<TResult>;
}
export declare type ChildProps<P, R> = P & {
    data?: QueryProps & Partial<R>;
    mutate?: MutationFunc<R>;
};
export declare type NamedProps<P, R> = P & {
    ownProps: R;
};
export declare type OperationVariables = {
    [key: string]: any;
};
export interface OperationOption<TProps, TResult> {
    options?: QueryOpts | MutationOpts | ((props: TProps) => QueryOpts | MutationOpts);
    props?: (props: OptionProps<TProps, TResult>) => any;
    skip?: boolean | ((props: any) => boolean);
    name?: string;
    withRef?: boolean;
    shouldResubscribe?: (props: TProps, nextProps: TProps) => boolean;
    alias?: string;
}
export declare type CompositeComponent<P> = ComponentClass<P> | StatelessComponent<P>;
export interface ComponentDecorator<TOwnProps, TMergedProps> {
    (component: CompositeComponent<TMergedProps>): ComponentClass<TOwnProps>;
}
export interface InferableComponentDecorator<TOwnProps> {
    <T extends CompositeComponent<TOwnProps>>(component: T): T;
}
