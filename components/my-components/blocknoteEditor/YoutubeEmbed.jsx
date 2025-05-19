import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { Menu } from "@mantine/core";
import './style.css'

const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export const YoutubeEmbed = createReactBlockSpec(
  {
    type: "YoutubeEmbed",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      url: {
        default: "",
      },
    },
    content: "inline",
  },
  {
    render: ({ block, editor, contentRef }) => {
      const videoUrl = block.props.url;

      const handleUrlChange = (e) => {
        editor.updateBlock(block, {
          props: { ...block.props, url: e.target.value },
        });
      };

      return (
        <div className="youtube-embed">
          {videoUrl && getYouTubeID(videoUrl) ? (
            <iframe
            className=" lg:w-[530px] lg:h-[295px] "
             // width="530"
             //height="295"
              src={`https://www.youtube.com/embed/${getYouTubeID(videoUrl)}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <input
              className="text-black  focus:outline-none focus:bg-slate-200 ease-in-out duration-300 rounded-xl px-4 py-2 focus:shadow-white"
              placeholder="Enter YouTube URL"
              value={videoUrl}
              onChange={handleUrlChange}
              onBlur={handleUrlChange}
            />
          )}
          <div ref={contentRef} />
        </div>
      );
    }
  }
);