// ==UserScript==
// @name         Copy Video Link Loader
// @namespace    https://github.com/noname-new
// @version      1.0.0
// @description  Loader for Copy Video Link
// @author       noname-new
// @match        *://*/*
// @run-at       document-start
//
// @grant        GM_xmlhttpRequest
//
// @connect      raw.githubusercontent.com
//
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================
    // CONFIG
    // =========================================================

    const SCRIPT_URLS = [
        "https://raw.githubusercontent.com/noname-new/copy_video_link/refs/heads/main/main_obf.js",
        "https://raw.githubusercontent.com/noname-new/copy_video_link/refs/heads/main/copylink_obf.js"
    ];


    // =========================================================
    // CHỐNG LOAD 2 LẦN
    // =========================================================

    if (window.__COPY_VIDEO_LINK_LOADER__) {
        return;
    }

    window.__COPY_VIDEO_LINK_LOADER__ = true;


    // =========================================================
    // LOG
    // =========================================================

    function log(...args) {
        console.log(
            "[Copy Video Link Loader]",
            ...args
        );
    }


    function warn(...args) {
        console.warn(
            "[Copy Video Link Loader]",
            ...args
        );
    }


    function error(...args) {
        console.error(
            "[Copy Video Link Loader]",
            ...args
        );
    }


    // =========================================================
    // KIỂM TRA CODE
    // =========================================================

    function isValid(code) {

        if (
            typeof code !== "string"
        ) {
            return false;
        }

        if (
            code.length < 100
        ) {
            return false;
        }

        const text =
            code.trim();

        // GitHub trả HTML lỗi
        if (
            text.startsWith("<!DOCTYPE") ||
            text.startsWith("<html") ||
            text.startsWith("<HTML")
        ) {
            return false;
        }

        return true;
    }


    // =========================================================
    // CHẠY SCRIPT
    // =========================================================

    function execute(code, url) {

        if (
            !isValid(code)
        ) {

            error(
                "Invalid script:",
                url
            );

            return false;
        }

        try {

            eval(code);

            log(
                "Executed:",
                url
            );

            return true;

        } catch (e) {

            error(
                "Execution failed:",
                url,
                e
            );

            return false;
        }
    }


    // =========================================================
    // TẢI 1 SCRIPT
    // =========================================================

    function loadScript(url) {

        return new Promise(function (resolve) {

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

                        error(
                            "HTTP",
                            response.status,
                            url
                        );

                        resolve(false);
                        return;
                    }


                    const code =
                        response.responseText || "";


                    if (
                        !isValid(code)
                    ) {

                        error(
                            "Invalid response:",
                            url
                        );

                        resolve(false);
                        return;
                    }


                    const success =
                        execute(
                            code,
                            url
                        );


                    resolve(success);
                },


                onerror(e) {

                    error(
                        "Network error:",
                        url,
                        e
                    );

                    resolve(false);
                },


                ontimeout() {

                    error(
                        "Timeout:",
                        url
                    );

                    resolve(false);
                }

            });

        });
    }


    // =========================================================
    // LOAD 2 FILE
    // =========================================================

    async function main() {

        log(
            "Starting..."
        );


        for (
            const url of SCRIPT_URLS
        ) {

            const success =
                await loadScript(url);


            if (!success) {

                warn(
                    "Failed:",
                    url
                );

            }

        }


        log(
            "All scripts processed."
        );
    }


    // =========================================================
    // START
    // =========================================================

    main();

})();
