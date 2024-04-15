const context = await esbuild.context({
    entryPoints: ["index.js"],
    bundle: true,
    minify: false,
    sourcemap: true,
    outfile: "dist/index.js"
})
await context.watch()
context.dispose()
