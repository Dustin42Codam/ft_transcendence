function UserStats(props: { userStats: any }) {
  console.log("ERRORS", props);
  return (
    <div className="text-center">
      played: {props.userStats.played}
      <br />
      won: {props.userStats.win}
      <br />
      lost: {props.userStats.lose}
    </div>
  );
}

export default UserStats;
