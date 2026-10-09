// @ts-check
import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc"
import starlightVersions from "starlight-versions"

export default defineConfig({
  site: "https://restfullycare.github.io",
  base: "/hootask",
  integrations: [
    starlight({
      title: "Hootask SDK",
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
        // After typedoc, so archived versions include the generated API pages.
        // Add the outgoing version here when releasing a new minor or major.
        starlightVersions({ versions: [{ slug: "0.0.1" }] }),
      ],
      sidebar: [
        { label: "Start here", items: ["getting-started"] },
        typeDocSidebarGroup,
      ],
    }),
  ],
})
