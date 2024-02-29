# def getProperEndPoint():

#     # https: // www.youtube.com / watch?v = d2hZzjJUFkg & list = PLrCjq1l6RqOpsQdKrSI_8wvPz0wPKj8nN
#     # https://www.youtube.com/watch?v=oEXZHviwAVw
#     # https://youtu.be/dQw4w9WgXcQ?t=42s
#     url_link="https://www.youtube.com/watch?v=oEXZHviwAVw"
#     url_link.split("https://www.youtube.com/watch?v")
#     print(url_link)
# getProperEndPoint()
def getProperEndPoint(url_link):
    # Check if the URL is a standard YouTube watch URL
    if "youtube.com/watch?v=" in url_link:
        video_id = url_link.split("youtube.com/watch?v=")[1].split("&")[0]
    # Check if the URL is a short YouTube URL
    elif "youtu.be/" in url_link:
        video_id = url_link.split("youtu.be/")[1].split("?")[0]
    else:
        # If the URL format is not recognized, return None or handle it accordingly
        video_id = "xsNkZq5YNDg"
    return video_id
# Example usage
# url_link = "https://www.youtube.com/watch?v=oEXZHviwAVw"
# video_id = getProperEndPoint(url_link)
# print(video_id)
