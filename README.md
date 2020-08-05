## Setup for new react app

1. Modify webpack config according to: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html#changes-required-in-both-webpack-configurations

## Conclusions

1. Comment adapter will support multiple DBs, but we will need some sophisticated logic on the backend in order to save this accordingly, which may be best suited in it's own service.

Possible solution for a POST API call to "Comments Service":

```
{
    projectId: Long,
    entityType: String ("hypothesis", "insight", etc..),
    entityId: Long/GUID,
    threadId: String,
    authorId: GUID,
    content: String
}
```

And a possible API response:

```
{
    projectId: Long,
    entityType: String ("hypothesis", "insight", etc..),
    entityId: Long/GUID,
    threadId: String,
    comments: [
        {
            commentId: GUID,
            authorId: GUID,
            content: String,
            createdAt: Date,
        },
    ]
}
```

2. We can optionally provide a user avatar photo (which can come from idAM in profile scope), if one does not exist then it only shows their initials with a background color.

3. We can distinguish between "external" and "internal" users in the "Comments Service" by looking at the JWT passed to the service. From there we can filter the DB query accordingly.

4. Comments can be outside of the editor, however we'll need some way to identify the element that was commented on. It might be possible to do this by embedding the element ID within the "threadId" field of the comment. All comments will need to be handled via CKEditor's context and a "sidebar" will need to be present (it can be hidden though).

5. Spelling/grammar checking can be enabled by using WebSpellChecker which integrates with CKEditor automatically, see: https://ckeditor.com/docs/ckeditor5/latest/features/spelling-and-grammar-checking.html

It will be possible to modify/add/delete our own dictionary on a per project basis by using WebSpellChecker's API as described here: https://docs.webspellchecker.net/display/WebSpellCheckerCloud/Using+Cloud+WebSpellChecker+Web+API

Note that grammar checking is not available under the trial license.

5. Though I wasn't able to get plugin creation to work according to their tutorial (will follow up with them), it looks like we can write a custom plugin in order to embed iframes into the editor content.

6. Messaging with @mentions plugin is promising to use to signal visibility (@everyone). Possible auto-fills can be provided to plugin. From there, service behind adapter provides controls.