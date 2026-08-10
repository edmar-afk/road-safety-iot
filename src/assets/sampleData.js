import alertImg from "../assets/images/alerts/alert.png";
import cautionImg from "../assets/images/alerts/caution.png";
import safeImg from "../assets/images/alerts/safe.png";
import mosquitoImg from "../assets/images/alerts/mosquito.png";
import proofImg from "../assets/images/alerts/proof1.jpg";

export const sampleData = [
  {
    id: 1,
    title: "Dengue Alert",
    uploader: "Sample Name",
    description:
      "High risk of dengue outbreak in your area. Take necessary precautions.",
    proof: proofImg,
    image: alertImg,
    position: [7.658643, 123.284165], // Center
  },
  {
    id: 2,
    title: "Caution Area",
    uploader: "Sample Name",
    description: "Gipang paak na mi sa mga lamok murag langaw kadak-a.",
    proof: proofImg,
    image: cautionImg,
    position: [7.66, 123.2857], // Northeast
  },
  {
    id: 3,
    title: "Safe Zone",
    uploader: "Sample Name",
    description: "No reported dengue cases in the past 30 days.",
    proof: proofImg,
    image: safeImg,
    position: [7.657, 123.286], // Southeast
  },
  {
    id: 4,
    title: "Mosquito Breeding Site",
    uploader: "Sample Name",
    description: "Gipang paak na mi sa mga lamok murag langaw kadak-a.",
    proof: proofImg,
    image: mosquitoImg,
    position: [7.6605, 123.2826], // Northwest
  },
  {
    id: 5,
    title: "Confirmed Dengue Case",
    uploader: "Sample Name",
    description: "One confirmed dengue patient reported.",
    proof: proofImg,
    image: alertImg,
    position: [7.6565, 123.2829], // Southwest
  },
];
