import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "./../../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  upperRow: {
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: SIZES.medium,
    width: SIZES.width - 30,
    zIndex: 999,
  },
  imageContainer: {
    width: SIZES.width,
    height: SIZES.width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  details: {
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.small,
  },
  price: {
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    marginBottom: SIZES.small,
  },
  detailsWrapper: {
    marginBottom: SIZES.medium,
  },
  detailItem: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 5,
  },
  descriptionWrapper: {
    marginBottom: SIZES.medium,
  },
  descriptionTitle: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: "justify",
  },
  commentsWrapper: {
    marginBottom: SIZES.medium,
  },
  commentsTitle: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentItem: {
    padding: SIZES.small,
    backgroundColor: COLORS.offwhite,
    borderRadius: SIZES.small,
    marginBottom: 10,
  },
  commentUser: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  commentText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginVertical: 5,
  },
  commentDate: {
    fontSize: SIZES.small - 2,
    color: COLORS.gray2,
  },
  viewMoreComments: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    textAlign: "center",
  },
  storeContainer: {
    padding: SIZES.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray2,
    backgroundColor: COLORS.white,
  },
  storeTitle: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontWeight: "bold",
    marginBottom: SIZES.small,
  },
  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  },
  storeInfo: {
    flex: 1,
  },
  storeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  storeName: {
    fontSize: SIZES.small + 2,
    color: COLORS.black,
    fontWeight: "600",
  },
  storeRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  storeRatingText: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginLeft: 3,
  },
  storeStats: {
    fontSize: SIZES.small - 2,
    color: COLORS.gray,
  },
  storeButton: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: SIZES.small,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.secondary,
  },
  storeButtonText: {
    fontSize: SIZES.small,
    color: COLORS.black,
  },
  storeError: {
    fontSize: SIZES.small,
    color: COLORS.red,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    backgroundColor: COLORS.offwhite,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
