// @ts-check
import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc"

export default defineConfig({
  site: "https://restfullycare.github.io",
  // build-site.sh builds older versions under /hootask/v<major.minor>/.
  base: process.env.DOCS_BASE ?? "/hootask",
  integrations: [
    starlight({
      title: "Hootask SDK",
      components: { SocialIcons: "./src/components/SocialIcons.astro" },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/RestfullyCare/hootask",
        },
      ],
      plugins: [
        starlightTypeDoc({
          entryPoints: ["../packages/js", "../packages/react"],
          tsconfig: "../packages/js/tsconfig.json",
          typeDoc: {
            entryPointStrategy: "packages",
            readme: "./api-readme.md",
          },
        }),
      ],
      sidebar: [
        { label: "Start here", items: ["getting-started"] },
        typeDocSidebarGroup,
      ],
    }),
  ],
})
