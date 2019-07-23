import {HTTP} from "./bootstrap"
import httpBuildQuery from 'http-build-query'

/**
 * For API search, return a promise
 *
 * @param url
 * @param params
 * @param headers
 * @returns {Promise<any>}
 */
export async function toSeek(url, params = null, headers = {}) {

    if(params !== null) url = url + '?' + httpBuildQuery(params)

    return await new Promise((resolve, reject) => {
        HTTP.get(url, {headers: headers}).then(
            response => resolve(response.data)
        ).catch(
            e => reject(e)
        )
    })
}

/**
 * @param url
 * @param data
 * @param headers
 * @returns {Promise<any>}
 */
export async function submitAPI(url, data, headers = {}) {

    return await new Promise((resolve, reject) => {
        HTTP({
            method: 'POST',
            url: url,
            data: data,
            headers: headers
        }).then(
            response => {
                resolve(response)
            }
        ).catch(
            error => {
                reject(error)
            }
        )
    })
}

/**
 * @param url
 * @param config
 * @returns {Promise<any>}
 */
export async function deleteAPI(url, config = {}) {
    return await new Promise((resolve, reject) => {
        HTTP.delete(url, config).then(result => resolve(result)).catch((error) => reject(error))
    });
}
