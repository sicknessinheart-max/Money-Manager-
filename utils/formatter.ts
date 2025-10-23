
export function money(n: number, currency: string = 'USD', locale: string = navigator.language): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(n || 0);
}
