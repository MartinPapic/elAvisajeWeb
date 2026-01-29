'use client'

import { colorInput } from '@sanity/color-input'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'
import { projectId, dataset, apiVersion } from './src/lib/sanity'

export default defineConfig({
    basePath: '/studio',
    projectId,
    dataset,
    schema,
    plugins: [
        structureTool(),
        visionTool({ defaultApiVersion: apiVersion }),
        colorInput(),
    ],
})
