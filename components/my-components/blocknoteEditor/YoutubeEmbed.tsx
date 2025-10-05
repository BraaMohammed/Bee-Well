import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import './style.css'
import React from 'react';

export const YoutubeEmbed = createReactBlockSpec(
  {
    type: "YoutubeEmbed",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      url: { default: "" },
    },
    content: "inline",
  },
  {
    render: ({ block, editor, contentRef }) => {
      const videoUrl = block.props.url;

      const getYouTubeID = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
      };

      const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        editor.updateBlock(block, {
          props: { ...block.props, url: e.target.value },
        });
      };

      const videoID = videoUrl ? getYouTubeID(videoUrl) : null;

      return (
        <div 
          className="youtube-embed"
          style={{
            textAlign: block.props.textAlignment,
          }}
        >
          {videoID ? (
            <iframe
              className="lg:w-[530px] lg:h-[295px]"
              src={`https://www.youtube.com/embed/${videoID}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <input
              className="text-black focus:outline-none focus:bg-slate-200 ease-in-out duration-300 rounded-xl px-4 py-2 focus:shadow-white"
              placeholder="Enter YouTube URL"
              value={videoUrl}
              onChange={handleUrlChange}
            />
          )}
          <div 
            ref={contentRef} 
            className="youtube-embed-inline-content"
            style={{ color: block.props.textColor }} 
          />
        </div>
      );
    },
  }
);