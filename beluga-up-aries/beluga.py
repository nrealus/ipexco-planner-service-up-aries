#! /usr/bin/env python3

import sys
import os

import unified_planning.shortcuts as up
import unified_planning.model.htn as up_htn

from unified_planning.model.expression import ConstantExpression
from unified_planning.plans.hierarchical_plan import HierarchicalPlan

from parser import *
from model import *

if __name__ == "__main__":

    output_folder = os.path.abspath(".") # os.path.abspath(sys.path[0])
    output_upp_path = os.path.join(output_folder, "problem/problem.upp")
    output_plan_path = os.path.join(output_folder, "plan/plan.json")

    rust_binary_path = os.path.abspath(".") # os.path.abspath(sys.path[0])

    if sys.argv[1] == "solve":
        initial_state_filename = sys.argv[2]
        additional_properties_filename = sys.argv[3]
        test_pb_def = parse_problem_with_additional_properties(initial_state_filename, additional_properties_filename)
        print(test_pb_def)
        # full_problem_filename = sys.argv[2]
        # test_pb_def = parse_problem_full(full_problem_filename)
        # print(test_pb_def)

        # # # # with fixed num of allowed_swaps # # # 
        # 
        # num_available_swaps = 3
        # test_beluga_model = BelugaModel(
        #     test_pb_def,
        #     initial_state_filename+"_"+additional_properties_filename,
        #     num_available_swaps,
        #     None,
        # )
        # serialize_problem(test_beluga_model.pb, output_upp_path)
        # (test_plan, test_plan_as_json) = test_beluga_model.solve()

        # # # with growing num of allowed_swaps (until limit or sol found) # # # 
    
        max_num_available_swaps = int(os.environ['MAX_NUM_AVAILABLE_SWAPS']) # int(os.environ.get('MAX_NUM_AVAILABLE_SWAPS', 10))
        num_available_swaps = 0
        while True:
            print('available swaps "spawned": {}'.format(num_available_swaps))
        
            test_beluga_model = BelugaModel(
                test_pb_def,
                initial_state_filename+"_"+additional_properties_filename,
                num_available_swaps,
                None,
            )
            (test_plan, test_plan_as_json) = test_beluga_model.solve()
        
            if test_plan is not None:
                break
            num_available_swaps += 1
            if num_available_swaps >= max_num_available_swaps:   # FIXME TODO temporary ?
                sys.exit(2)                                      # FIXME TODO temporary ?

        assert (test_plan is None and test_plan_as_json is None) or (test_plan is not None and test_plan_as_json is not None)
        print(test_plan_as_json)

        if test_plan_as_json is not None:
            os.makedirs(os.path.dirname(output_plan_path), exist_ok=True)
            with open(output_plan_path, 'w', encoding='utf-8') as f:
                json.dump(test_plan_as_json, f, ensure_ascii=False, indent=4)
                sys.exit(0)
        assert False

    else:
        print("UNKNOWN (OR NOT YET IMPLEMENTED) SUBCOMMAND {}".format(sys.argv[1]))
