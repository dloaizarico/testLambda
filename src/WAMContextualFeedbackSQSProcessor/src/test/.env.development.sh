# A shell script to mock the lambda environment variables for local development and testing
# This script is used by the 'yarn run local' command in package.json
echo getting env vars
# An AWS profile to use which provides permissions to access the AWS resources; this would normally be provided by the lambda environment
export AWS_PROFILE=elastik
# The AWS region to use; this would normally be provided by the lambda environment
export AWS_REGION=ap-southeast-2
# The environment to use; this would normally be provided by the lambda environment via cloudformation
export REGION=ap-southeast-2
# The amplify environment to use; this would normally be provided by the lambda environment via cloudformation
export ENV=develop
# When NODE_ENV is set to "development" and USE_COGNITO_* are set the lambda will use the COGNITO_* to authenticate with the GraphQL API
export NODE_ENV=development
# The name of the GraphQL API; this would normally be provided by the lambda environment via cloudformation
export API_BPEDSYSGQL_GRAPHQLAPIIDOUTPUT=swoz4wfv4fevbmi2wayyzf5kjy
# The endpoint of the GraphQL API; this would normally be provided by the lambda environment via cloudformation
export API_BPEDSYSGQL_GRAPHQLAPIENDPOINTOUTPUT=https://swoz4wfv4fevbmi2wayyzf5kjy.appsync-api.ap-southeast-2.amazonaws.com/graphql
# The API key to use for OpenAI - this is just Mikes temp key for testing skipcq: SCT-1013
export OPEN_AI_API_KEY=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
# Base URL for OpenAI
export OPEN_AI_BASE_URL=https://api.openai.com/v1/chat/completions
# Model to use for OpenAI
OPEN_AI_MODEL=ft:gpt-3.5-turbo-1106:elastik::8NjO2uNE
# The cognito username and password to use for authentication with faculty and the GraphQL API
export COGNITO_USERNAME=admin@bestperformance.com.au
# This is an SSM parameter which is used to get the password for the COGNITO_USERNAME
export LAMBDA_FACULTY_COGNITO_USER_PASSWORD=/amplify/d31ul62nbvaagu/develop/AMPLIFY_getContextualFeedbackForStudentEssaysScheduled_LAMBDA_FACULTY_COGNITO_USER_PASSWORD
# These will be provided to the lambda by cloudformation
export AUTH_BPEDSYSAUTH_USERPOOLID=ap-southeast-2_bjwWhJw4s
export AUTH_BPEDSYSAUTH_APPCLIENTIDWEB=65k24rpr15ii43qllc58riargu
# The prompt to use for OpenAI, as a Lodash template ; uses heredoc syntax
# NOTE: this sometimes causes an OpenAI error if the prompt is too long
export OPEN_AI_PROMPT=$(
cat <<'END_OPENAI_PROMPT_TEXT_VAR'
You are a helpful essay feedback bot, focused on providing valuable, helpful, and encouraging feedback to students based on their submitted work and the given grades in eleven different areas of a rubric, including a final mark. For each area, carefully read and analyse the student's work, and provide specific feedback including quotes and suggestions for improvement but do not include the grades. Praise the student's strengths while also offering actionable advice for areas with lower scores. Address each area of the rubric individually, providing detailed feedback and quotes in JSON format for a more authentic and engaging experience
END_OPENAI_PROMPT_TEXT_VAR
)
# If this is set, it overrides the EMT API URL used by the lambda (useful for local development)
export DEV_OVERRIDE_EMT_API_URL=https://dev-aus.elastik-emt.com/
# Determines whether to use Cognito for authentication with the GraphQL API i.e. in development mode
export USE_COGNITO_FOR_APPSYNC_AUTH=true
export DEV_APPSYNC_COGNITO_USER=mike@bestperformance.com.au
export DEV_APPSYNC_COGNITO_PASS=Password22!
