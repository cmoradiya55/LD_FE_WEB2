type MyActivityComponentProps = {
  activeTab?:
    | 'used-car-searches'
    | 'questions-for-you'
    | 'answers'
    | 'questions-asked'
    | 'your-reviews';
};

const titleMap: Record<NonNullable<MyActivityComponentProps['activeTab']>, string> = {
  'used-car-searches': 'Your used car searches',
  'questions-for-you': 'Questions for you',
  answers: 'Answers',
  'questions-asked': 'Questions Asked',
  'your-reviews': 'Your review',
};

const descriptionMap: Record<NonNullable<MyActivityComponentProps['activeTab']>, string> = {
  'used-car-searches': 'See your recent used car searches and quickly revisit them.',
  'questions-for-you': 'View questions that need your input to get better recommendations.',
  answers: 'Review answers you have given previously.',
  'questions-asked': 'See the questions you have asked to sellers or experts.',
  'your-reviews': 'Manage and edit reviews you have written.',
};

const MyActivityComponent = ({ activeTab = 'used-car-searches' }: MyActivityComponentProps) => {
  const title = titleMap[activeTab];
  const description = descriptionMap[activeTab];

  return (
    <>
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">{description}</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-10 py-8 sm:py-10">
        <p className="text-xs sm:text-sm text-slate-500">
          No activity available yet for this section.
        </p>
      </div>
    </>
  );
};

export default MyActivityComponent;