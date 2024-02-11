export async function getUser() {
  const response = await fetch(
    "https://api.twitterpicker.com/user/data?minimal=twittercircle&id=mayonkkumar"
  );

  const userInfo = await response.json();
  console.log("====================================");
  console.log(userInfo);
  console.log("====================================");
}
