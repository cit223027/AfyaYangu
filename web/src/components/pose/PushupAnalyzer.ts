// Import TensorFlow.js library
import * as tf from '@tensorflow/tfjs';
import {Pose, PoseAnalyzer} from "@/components/pose/PoseEstimation.tsx";

export default class PushupAnalyzer {

    static createPushUpAnalyzer(
        onAnalysis: (isTrueLandmark: boolean) => void
    ): PoseAnalyzer {
        let model: tf.LayersModel | null = null;
        let isReadyForAnalysis = false;
        let wasPreviouslyTrue = false;

        const initialize = async (): Promise<void> => {
            try {
                // Load the model (ensure the correct path to your model)
                model = await tf.loadLayersModel('/models/pushup_model/pose_model.json');
                isReadyForAnalysis = true;
                console.log('Model loaded successfully');
            } catch (error) {
                console.error('Error loading model:', error);
                isReadyForAnalysis = false;
            }
        };

        const analyzePose = (poses: Pose[]): void => {
            console.log("Pushup Analyzer: analyzing pose...")
            if (!model || poses.length !== 1) {
                console.log("Pushup Analyzer: returning at first if")
                return
            }

            isReadyForAnalysis = true

            // Assuming poses contain a list of Pose objects, extract landmarks
            // Flatten the PoseWorldLandmark into an array of [x, y, z, visibility] for all 33 landmarks
            const inputArray: number[] = poses[0].landmarks.flatMap((landmark) => [
                landmark.x,
                landmark.y,
                landmark.z,
                landmark.visibility,
            ]);

            // Convert to tensor
            const inputTensor = tf.tensor([inputArray]);

            // Run prediction
            const prediction = model.predict(inputTensor) as tf.Tensor;
            const predictionResult = prediction.dataSync(); // Get the result

            // Assuming the model returns a binary classification (0 or 1)
            const isLandmarkTrue = predictionResult[0] > 0.5; // Threshold at 0.5 for binary classification

            isReadyForAnalysis = true

            // Prevents multiple counts of true until a false is recognized
            if (isLandmarkTrue) {
                if (wasPreviouslyTrue) {
                    onAnalysis(false)
                } else {
                    onAnalysis(true)
                }
            } else {
                onAnalysis(isLandmarkTrue)
            }
            wasPreviouslyTrue = isLandmarkTrue
        };

        return {
            initialize: initialize,
            checkIfReadyForAnalysis: () => { return isReadyForAnalysis },
            analyzePose: analyzePose
        };

    }
}
