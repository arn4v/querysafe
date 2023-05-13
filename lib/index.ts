import {
  QueryClient,
  QueryKey,
  SetDataOptions,
  Updater,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
type QueryFn = (...args: any[]) => any;

type SafekitUseQueryOptions<TData = unknown> = Omit<
  UseQueryOptions<TData, unknown, TData>,
  "queryKey" | "queryFn"
>;

interface SafekitUseQueryHook<
  TQueryFn extends QueryFn,
  TData extends Awaited<ReturnType<TQueryFn>> = Awaited<ReturnType<TQueryFn>>,
  TQueryFnParams extends Parameters<TQueryFn> = Parameters<TQueryFn>,
  THasParams extends TQueryFnParams[number] extends never
    ? false
    : true = TQueryFnParams[number] extends never ? false : true
> {
  (
    ...args: THasParams extends true
      ? [params: TQueryFnParams, options?: SafekitUseQueryOptions<TData>]
      : [options?: SafekitUseQueryOptions<TData>]
  ): UseQueryResult<TData, unknown>;
  // (

  //   options?: THasParams extends true ? never : SafekitUseQueryOptions<TData>,
  // ): UseQueryResult<TData, unknown>;
  // (
  //   options: THasParams extends true
  //     ? SafekitUseQueryOptions<TData> & { params: TQueryFnParams }
  //     : never,
  // ): UseQueryResult<TData, unknown>;
}

export function createQuerysafe(queryClient: QueryClient) {
  function createQuery<
    TQueryFn extends QueryFn,
    TData extends Awaited<ReturnType<TQueryFn>> = Awaited<ReturnType<TQueryFn>>,
    TQueryFnParams extends Parameters<TQueryFn> = Parameters<TQueryFn>
  >(cfg: { baseQueryKey: string | readonly string[]; queryFn: TQueryFn }) {
    let baseQueryKey =
      typeof cfg.baseQueryKey === "string"
        ? [cfg.baseQueryKey]
        : cfg.baseQueryKey;

    return {
      queryFn: cfg.queryFn,
      useQuery: ((...args) => {
        const __params = Array.isArray(args[0]) ? args[0] : [];
        const __options = Array.isArray(args[0]) ? args[1] : args[0];

        return useQuery<TData, unknown, TData>(
          [...baseQueryKey, ...(__params ? [__params] : [])],
          () => cfg.queryFn.apply(null, [__params]),
          {
            ...__options,
          }
        );
      }) satisfies SafekitUseQueryHook<TQueryFn, TData, TQueryFnParams>,
      getKey(params: TQueryFnParams) {
        return [...baseQueryKey, params] satisfies QueryKey;
      },
      setQueryData(
        params: TQueryFnParams,
        updater: Updater<TData | undefined, TData | undefined>,
        options?: SetDataOptions
      ) {
        const queryKey = [...baseQueryKey, params] satisfies QueryKey;
        return queryClient.setQueryData<TData>(queryKey, updater, options);
      },
      invalidate(params: TQueryFnParams) {
        return queryClient.invalidateQueries([...baseQueryKey, params]);
      },
    };
  }

  function createMutation<
    TMutationFn extends QueryFn,
    TData extends Awaited<ReturnType<TMutationFn>> = Awaited<
      ReturnType<TMutationFn>
    >
  >(cfg: { mutationFn: (...args: any[]) => any }) {
    return {
      useMutation(
        options: Omit<
          UseMutationOptions<TData, unknown, void, unknown>,
          "mutationFn"
        > = {}
      ) {
        return useMutation({
          ...options,
          mutationFn: cfg.mutationFn,
        });
      },
    };
  }

  return {
    createQuery,
    createMutation,
  };
}
