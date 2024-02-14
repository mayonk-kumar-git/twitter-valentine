function randomBetween(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function corsProxyFetch(url) {
  try {
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    );
    const jsonResponse = await response.json();
    const actualResponse = JSON.parse(jsonResponse.contents);
    return actualResponse;
  } catch (error) {
    // console.log("error while making network call to url:", url);
  }
}

export async function getFullUserInfo(userName) {
  const response = await corsProxyFetch(
    `https://api.twitterpicker.com/user/data?&id=${userName}`
  );
  // console.log("====================================");
  // console.log("name:", response?.name);
  // console.log("====================================");
  return response;
}

export async function getUserInfo(userName) {
  const response = await corsProxyFetch(
    `https://api.twitterpicker.com/user/data?minimal=twittercircle&id=${userName}`
  );

  return response;
}

export async function fetchUserTimeline(userId, cursor) {
  let url = `https://api.twitterpicker.com/user/timeline?minimal=twittercircle&username=${userId}`;
  if (cursor) {
    url = url + `&cursor=${cursor}`;
  }
  const response = await corsProxyFetch(url);
  return response;
}

export async function fetchLikedPosts(userId, cursor) {
  let url = `https://api.twitterpicker.com/user/likes?minimal=twittercircle&username=${userId}`;
  if (cursor) {
    url = url + `&cursor=${cursor}`;
  }
  const response = await corsProxyFetch(url);
  return response;
}

export async function getUserTimeline(userId) {
  let timeline = [];
  let cursor;
  for (let index = 0; index < 4; ++index) {
    const response = await fetchUserTimeline(userId, cursor);
    if (!response.entries || response.entries.length == 0) {
      break;
    }
    cursor = response.cursor;
    timeline = [...timeline, ...response.entries];
  }
  return timeline;
}

export async function getLikedPosts(userId) {
  let likedPosts = [];
  let cursor;
  for (let index = 0; index < 5; ++index) {
    const response = await fetchLikedPosts(userId, cursor);
    if (!response.entries || response.entries.length == 0) {
      break;
    }
    cursor = response.cursor;
    likedPosts = [...likedPosts, ...response.entries];
  }
  return likedPosts;
}

async function getGender(name) {
  const firstName = name.split(" ")[0];
  const response = await fetch(`https://api.genderize.io/?name=${firstName}`);
  const jsonResponse = await response.json();
  if (jsonResponse.probability > 0.8) {
    return jsonResponse.gender;
  }
  return null;
}

/**
 * A small function that records an interaction.
 * If a user already exists in the interactions object, increment the count for the specific type.
 * Otherwise create a new object for the user and set the type for this interaction to 1
 *
 * @param interactions our array to which to add the record
 * @param screen_name
 * @param user_id
 * @param type 'reply' | 'retweet' | 'like'
 */
function addRecord(interactions, screen_name, user_id, type) {
  if (user_id in interactions) interactions[user_id][type] += 1;
  else
    interactions[user_id] = {
      screen_name,
      id: user_id,
      reply: 0,
      retweet: 0,
      like: 0,
      [type]: 1,
    };
}

/**
 * Loop over the timeline posts and record the ones where they are a reply to someone
 * To know if it's a reply the in_reply_to_user_id_str property will not be null.
 * We also need to make sure that in_reply_to_screen_name is different from our own screen_name to avoid adding ourselves
 * @param interactions
 * @param timeline
 * @param screen_name
 */
function countReplies(interactions, timeline, screen_name) {
  for (const post of timeline) {
    if (
      !!post.in_reply_to_user_id_str &&
      post.in_reply_to_screen_name.toLowerCase() !== screen_name
    ) {
      addRecord(
        interactions,
        post.in_reply_to_screen_name,
        post.in_reply_to_user_id_str,
        "reply"
      );
    }
  }
}

/**
 * Loop over the timeline posts and record the ones where they are a retweet to someone else's posts
 * To know if it's a retweet the retweeted_status property will not be null.
 * We also need to make sure that retweeted_status.user.screen_name is different from our own screen_name to avoid adding ourselves
 * @param interactions
 * @param timeline
 * @param screen_name
 */
function countRetweets(interactions, timeline, screen_name) {
  for (const post of timeline) {
    if (
      post.retweeted_status &&
      post.retweeted_status.user &&
      post.retweeted_status.user.screen_name.toLowerCase() !== screen_name
    ) {
      addRecord(
        interactions,
        post.retweeted_status.user.screen_name,
        post.retweeted_status.user.id_str,
        "retweet"
      );
    }
  }
}

/**
 * Loop over the liked posts and record the all the ones that are not ours.
 * @param interactions
 * @param likes
 * @param screen_name
 */
function countLikes(interactions, likes, screen_name) {
  for (const post of likes) {
    if (post.user.screen_name.toLowerCase() !== screen_name) {
      addRecord(interactions, post.user.screen_name, post.user.id_str, "like");
    }
  }
}

export async function findValentine(
  username,
  setValentineUsername,
  setUserAvatar,
  setValentineAvatar,
  setLoading
) {
  if (username.length === 0) {
    alert("Please enter a valid username");
    setLoading(100);
    return;
  }

  if (username.charAt(0) === "@") {
    username = username.slice(1);
  }
  // const username = "mayonkkumar";
  // const username = "suereact";
  // const username = "dev_avocado";
  try {
    setLoading(randomBetween(5, 9));
    const user = await getFullUserInfo(username);
    // console.log(user);
    setUserAvatar(
      user.profile_image_url_https.replace("_normal.jpg", "_400x400.jpg")
    );
    const userGender = await getGender(user.name);
    setLoading(randomBetween(9, 15));
    const timeline = await getUserTimeline(user.id_str);
    setLoading(randomBetween(15, 35));
    // console.log("timeline:", timeline?.length);
    const liked = await getLikedPosts(user.id_str);
    setLoading(randomBetween(35, 60));
    // console.log("liked:", liked?.length);

    /**
     * This is the main place where we are going to keep our data as we process it.
     * It's an object where the key is the user_id and the values is an object like this:
     * {
     *		screen_name: string,
     *		id: string,
     *		reply: number,
     *		retweet: number,
     *		like: number,
     * }
     */
    const interactions = {};

    countReplies(interactions, timeline, user.screen_name);
    setLoading(randomBetween(60, 65));
    countRetweets(interactions, timeline, user.screen_name);
    setLoading(randomBetween(65, 70));
    countLikes(interactions, liked, user.screen_name);
    setLoading(randomBetween(70, 75));

    const tally = [];

    /**
     * This is the heart of the algorithm.
     * We process all the collected interactions and assign a value to them and count the total.
     * We stored the processed interactions in our `tally` array.
     * Each object in our tally array looks like this:
     * {
     *		screen_name: string,
     *		id: string,
     *		total: number
     * }
     */
    for (const [key, interaction] of Object.entries(interactions)) {
      let total = 0;
      total += interaction.like;
      total += interaction.reply * 1.1;
      total += interaction.retweet * 1.3;

      tally.push({
        id: interaction.id,
        screen_name: interaction.screen_name,
        total,
      });
    }

    // sort the tally array by total descending
    tally.sort((a, b) => b.total - a.total);
    setLoading(randomBetween(90, 95));

    if (tally.length === 0) {
      alert("You are too lonely to have a valentine. Please get a life");
      setLoading(100);
      return;
    }

    // console.log("====================================");
    // console.log(tally);
    // console.log("====================================");

    if (!userGender) {
      // console.log("====================================");
      // console.log("valentine:", tally[0]);
      // console.log("====================================");
      const userInfo = await getFullUserInfo(tally[0].screen_name);
      setValentineUsername(userInfo.screen_name);
      setValentineAvatar(
        userInfo.profile_image_url_https.replace("_normal.jpg", "_400x400.jpg")
      );
      setLoading(100);
      return;
    } else {
      for (const user of tally) {
        const userInfo = await getFullUserInfo(user.screen_name);
        const gender = await getGender(userInfo.name);
        if (
          (gender === "female" && userGender === "male") ||
          (gender === "male" && userGender === "female")
        ) {
          // console.log("====================================");
          // console.log(userInfo);
          // console.log("====================================");
          setValentineUsername(userInfo.screen_name);
          setValentineAvatar(
            userInfo.profile_image_url_https.replace(
              "_normal.jpg",
              "_400x400.jpg"
            )
          );
          setLoading(100);
          return;
        }
      }
      if (tally.length === 0) {
        alert(
          "Too much network traffic. Poor server can't handle ;(. Try after sometime"
        );
        setLoading(100);
        return;
      }
      // console.log("====================================");
      // console.log("no compatible user so:", tally[0]);
      // console.log("====================================");
      const userInfo = await getFullUserInfo(tally[0].screen_name);
      setValentineUsername(userInfo.screen_name);
      setValentineAvatar(
        userInfo.profile_image_url_https.replace("_normal.jpg", "_400x400.jpg")
      );
      setLoading(100);
    }
  } catch (error) {
    alert(
      "Too much network traffic. Poor server can't handle ;(. Try after sometime"
    );
    setLoading(100);
    return;
  }
}
