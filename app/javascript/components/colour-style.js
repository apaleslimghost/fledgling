import mapKeys from 'lodash.mapkeys'

export default colours => mapKeys(
    colours,
    (_, key) => `--colour-${key}`
)
