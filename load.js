// ==UserScript==
// @name         Copy Video Link Loader
// @namespace    https://github.com/noname-new
// @version      1.1.0
// @description  Copy Video Link Loader
// @author       noname-new
// @match        *://*/*
// @run-at       document-start
//
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
//
// @connect      raw.githubusercontent.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
//
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    const URLS = [
        "https://raw.githubusercontent.com/noname-new/copy_video_link/refs/heads/main/main_obf.js",
        "https://raw.githubusercontent.com/noname-new/copy_video_link/refs/heads/main/copylink_obf.js"
    ];

    if (window.__COPY_VIDEO_LINK_LOADER__) {
        return;
    }

    window.__COPY_VIDEO_LINK_LOADER__ = true;


    function log(...args) {
        console.log(
            "[Copy Video Link Loader]",
            ...args
        );
    }


    function run(code, url) {

        if (
            typeof code !== "string" ||
            code.length < 100 ||
            code.trim().startsWith("<")
        ) {
            console.error(
                "[Copy Video Link Loader] Invalid:",
                url
            );

            return false;
        }

        try {

            const fn = new Function(
                "GM_getValue",
                "GM_setValue",
                "GM_xmlhttpRequest",
                code
            );

            fn(
                GM_getValue,
                GM_setValue,
                GM_xmlhttpRequest
            );

            log(
                "Executed:",
                url
            );

            return true;

        } catch (e) {

            console.error(
                "[Copy Video Link Loader] Execution failed:",
                url,
                e
            );

            return false;
        }
    }


    function load(url) {

        log(
            "Downloading:",
            url
        );

        GM_xmlhttpRequest({

            method: "GET",

            url: url,

            timeout: 15000,

            headers: {
                "Cache-Control": "no-cache"
            },

            onload(response) {

                if (
                    response.status !== 200
                ) {
                    console.error(
                        "[Copy Video Link Loader] HTTP:",
                        response.status,
                        url
                    );

                    return;
                }

                run(
                    response.responseText,
                    url
                );
            },

            onerror(error) {

                console.error(
                    "[Copy Video Link Loader] Network error:",
                    url,
                    error
                );
            },

            ontimeout() {

                console.error(
                    "[Copy Video Link Loader] Timeout:",
                    url
                );
            }
        });
    }


    // Chạy theo thứ tự
    async function main() {

        log("Starting...");

        for (
            const url of URLS
        ) {
            load(url);
        }

        log("All scripts requested.");
    }


    main();

})();
