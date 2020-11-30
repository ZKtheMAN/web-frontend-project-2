export async function grabData<TPrototype, TResultantType>(
    url: string,
    converter: (val: TPrototype, index: number) => TResultantType)
    : Promise<TResultantType[]> {
    const response = await fetch(url);
    const body = await response.json();
    return body.map(converter);
}